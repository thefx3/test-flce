// models/testModel.js
import prisma from "../prisma/prisma.js";

const responseSelect = {
  responseId: true,
  questionId: true,
  answerBool: true,
  answerText: true,
  score: true,
};

const baseTestSelect = {
  testId: true,
  userId: true,
  status: true,
  testscore: true,
  created: true,
  testresponse: {
    select: responseSelect,
  },
};

function pickAllowedFields(source, allowedFields) {
  const safe = {};
  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      safe[key] = source[key];
    }
  }
  return safe;
}

const mapTest = (test) => {
  if (!test) return null;
  const { testresponse, ...rest } = test;
  return { ...rest, responses: testresponse ?? [] };
};

class TestModel {

//Public & Admin
async createTest(userId) {
  // If the user already has a test (userId is unique), reuse it instead of crashing
  const existing = await prisma.test.findUnique({
    where: { userId },
    include: { testresponse: true },
  });

  // Load all questions once (used for both new and existing tests)
  const questions = await prisma.question.findMany({
    orderBy: { order: "asc" },
  });

  if (existing) {
    // Create missing responses if new questions were added after the first attempt
    const existingQuestionIds = new Set(
      existing.testresponse.map(r => r.questionId)
    );
    const missingResponses = questions
      .filter(q => !existingQuestionIds.has(q.questionId))
      .map(q => ({
        testId: existing.testId,
        questionId: q.questionId,
        answerBool: null,
        answerText: "",
        score: 0,
      }));

    if (missingResponses.length > 0) {
      await prisma.testResponse.createMany({ data: missingResponses });
    }

    return this.getTestById(existing.testId);
  }

  // Create a brand-new test for this user
  const test = await prisma.test.create({
    data: {
      userId,
      status: "DEFAULT",
    },
  });

  const responsesData = questions.map(q => ({
    testId: test.testId,
    questionId: q.questionId,
    answerBool: null,
    answerText: "",
    score: 0,
  }));

  if (responsesData.length > 0) {
    await prisma.testResponse.createMany({ data: responsesData });
  }

  return this.getTestById(test.testId);
}

async updateTest(testId, data){
  const allowed = ["status"];

  const safeData = pickAllowedFields(data, allowed);

  return prisma.test.update({
    where: { testId },
    data: safeData,
    select: baseTestSelect,
  });
}

//Public
async getTestById(testId) {
  const test = await prisma.test.findUnique({
    where: { testId },
    select: baseTestSelect
  });
  return mapTest(test);
}

async getAllTestsByUserId(userId) {
  const tests = await prisma.test.findMany({
    where: { userId },
    select: baseTestSelect,
  });
  return tests.map(mapTest);
}

//Admin
async getAllTests() {
  const tests = await prisma.test.findMany({
    orderBy: { testId: "asc" },
    select: {
      testId: true,
      userId: true,
      status: true,
      testscore: true,
      created: true,
      user: {
        select: {
          email: true,
          name: true,
          lastname: true,
          profile: {
            select: {
              nationality: true,
              birthdate: true,
            },
          },
        },
      },
      testresponse: {
        select: {
          responseId: true,
          questionId: true,
          answerBool: true,
          answerText: true,
          score: true,
          question: {
            select: {
              type: true,
              text: true,
              correctBool:true,
              correctText: true,
              points: true,
              order: true,
              videoId: true,
              video: { select: { videoId: true, url: true, title: true } },
            }
          }
        }
      }
    }
  });
  return tests.map(t => {
    const totalPoints = (t.testresponse || []).reduce(
      (acc, r) => acc + (r.question?.points || 0),
      0
    );
    return { ...mapTest(t), totalPoints };
  });
}

async getSingleTestAdmin(testId) {
  const test = await prisma.test.findUnique({
    where: { testId },
    select: {
      testId: true,
      userId: true,
      status: true,
      testscore: true,
      testresponse: {
        select: {
          responseId: true,
          questionId: true,
          answerBool: true,
          answerText: true,
          score: true,
          question: {
            select: {
              questionId: true,
              type: true,
              text: true,
              correctBool:true,
              correctText: true,
              points: true,
              order: true,
              videoId: true,
              video: { select: { videoId: true, url: true, title: true } },
            }
          }
        }
      }
    }
  });
  const totalPoints = (test?.testresponse || []).reduce(
    (acc, r) => acc + (r.question?.points || 0),
    0
  );
  return test ? { ...mapTest(test), totalPoints } : null;
}

async countAllTestsAdmin(){
  return prisma.test.count()
}

async countAllTestsToGradeAdmin(){
  return prisma.test.count({ 
    where:  {
      NOT: {
        status: "CORRECTED",
      },
    },
  })
}


async deleteSingleTest(testId){
  return prisma.test.delete({ where: { testId } });
}

async deleteAllTestsByUserId(userId){
  return prisma.test.deleteMany({ where : { userId } })
}

async submitAnswers(answers) {
    // answers = [{ responseId, answerBool?, answerText? }]
    if (!Array.isArray(answers) || answers.length === 0) {
      return { message: "No answers to update" };
    }

    const updates = answers.map(a =>
      prisma.testResponse.update({
        where: { responseId: a.responseId },
        data: {
          answerBool: a.answerBool ?? null,
          answerText: a.answerText ?? "",
        },
      })
    );

    await prisma.$transaction(updates);
    return { message: "Responses updated" };
}

async gradeAuto(testId) {
    const responses = await prisma.testResponse.findMany({
      where: { testId },
      include: { question: true },
    });

    const normalize = (s) =>
      s === null || s === undefined
        ? ""
        : s.toString().trim().toLowerCase();

    const updates = responses
      // Auto-grade tout sauf les questions ouvertes
      .filter(r => r.question.type !== "OPEN")
      .map(r => {
        const q = r.question;
        let isCorrect = false;

        // Si correctBool est défini (questions booléennes)
        if (q.correctBool !== null && q.correctBool !== undefined) {
          isCorrect = r.answerBool === q.correctBool;
        }
        // Sinon comparer le texte (QCM/VIDEO)
        else if (q.correctText) {
          isCorrect = normalize(r.answerText) === normalize(q.correctText);
        }

        const score = isCorrect ? q.points : 0;

        return prisma.testResponse.update({
          where: { responseId: r.responseId },
          data: { score },
        });
      });

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    const totals = responses.reduce(
      (acc, r) => {
        acc.score += r.score || 0;
        acc.max += r.question?.points || 0;
        return acc;
      },
      { score: 0, max: 0 }
    );

    await prisma.test.update({
      where: { testId },
      data: { status: "AUTO_GRADED", testscore: totals.score },
    });

    return this.getSingleTestAdmin(testId);
}

async gradeManual(grades) {
    // grades = [{ responseId, score }]

    if (!Array.isArray(grades) || grades.length === 0) {
      return { message: "No grades to update" };
    }

    const updates = grades.map(g =>
      prisma.testResponse.update({
        where: { responseId: g.responseId },
        data: { score: g.score },
      })
    );

    await prisma.$transaction(updates);
    return { message: "Manual grading updated" };
}
 
async finalizeGrading(testId) {
    const responses = await prisma.testResponse.findMany({
      where: { testId },
      select: { score: true, question: { select: { points: true } } },
    });
    const totals = responses.reduce(
      (acc, r) => {
        acc.score += r.score || 0;
        acc.max += r.question?.points || 0;
        return acc;
      },
      { score: 0, max: 0 }
    );

    await prisma.test.update({
      where: { testId },
      data: { status: "CORRECTED", testscore: totals.score },
    });

    return this.getSingleTestAdmin(testId);
}

//Admin
async getScoreOfTest(testId) {
  const responses = await prisma.testResponse.findMany({
    where: { testId },
    select: {
      score: true,
      question: { select: { points: true } },
    },
  });

  const totals = responses.reduce(
    (acc, r) => {
      acc.score += r.score || 0;
      acc.max += r.question?.points || 0;
      return acc;
    },
    { score: 0, max: 0 }
  );

  // Met à jour la table Test pour éviter de recalculer côté front
  await prisma.test.update({
    where: { testId },
    data: { testscore: totals.score },
  });

  return { score: totals.score, totalPoints: totals.max };
}

}

export default new TestModel();
