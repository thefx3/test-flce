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
  testresponse: {
    select: responseSelect,
  },
};

const mapTest = (test) => {
  if (!test) return null;
  const { testresponse, ...rest } = test;
  return { ...rest, responses: testresponse ?? [] };
};

class TestModel {

// ===== TESTS =====
  async createTest(userId) {
    // Create test row
    const test = await prisma.test.create({
      data: {
        userId,
        status: "IN_PROGRESS",
      },
    });

    // Load all questions
    const questions = await prisma.question.findMany({
      orderBy: { order: "asc" },
    });

    // Create empty responses
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

  async getTestAdmin(testId) {
    const test = await prisma.test.findUnique({
      where: { testId },
      select: {
        testId: true,
        userId: true,
        testresponse: {
          select: {
            id: true,
            questionId: true,
            answerBool: true,
            answerText: true,
            score: true,
            question: {
              select: {
                type: true,
                text: true,
                mediaUrl: true,
                correctBool:true,
                correctText: true,
                points: true,
                order: true
              }
            }
          }
        }
      }
    });
    return mapTest(test);
  }

  async getTestById(testId) {
    const test = await prisma.test.findUnique({
      where: { testId },
      select: baseTestSelect
    });
    return mapTest(test);
  }
  
  async getTestsByUserId(userId) {
    const tests = await prisma.test.findMany({
      where: { userId },
      select: baseTestSelect,
    });
    return tests.map(mapTest);
  }

  async getAllTests() {
    const tests = await prisma.test.findMany({
      orderBy: { testId: "asc" },
      select: {
        testId: true,
        userId: true,
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
                mediaUrl: true,
                correctBool:true,
                correctText: true,
                points: true,
                order: true
              }
            }
          }
        }
      }
    });
    return tests.map(mapTest);
  }

  async deleteTest(testId){
    return prisma.test.delete({ where: { testId } });
  }

  async deleteTests(userId){
    return prisma.test.delete({ where : { userId } })
  }

// ===== SUBMIT =====
  async submitAnswers(answers) {
    // answers = [{ responseId, answerBool?, answerText? }]
    if (!Array.isArray(answers) || answers.length === 0) {
      return { message: "No answers to update" };
    }

    const updates = answers.map(a =>
      prisma.testResponse.update({
        where: { responseId: a.responseId },
        data: {
          answerBool:
            a.answerBool === undefined ? null : a.answerBool,
          answerText:
            a.answerText === undefined ? "" : a.answerText,
        },
      })
    );

    await prisma.$transaction(updates);
    return { message: "Responses updated" };
  }

// ===== GRADES =====
  async gradeAuto(testId) {
    const responses = await prisma.testResponse.findMany({
      where: { testId },
      include: { question: true },
    });

    const updates = responses
      .filter(r => r.question.type !== "OPEN")
      .map(r => {
        const correct = r.question.correctBool;
        const score =
          r.answerBool === correct ? r.question.points : 0;

        return prisma.testResponse.update({
          where: { responseId: r.responseId },
          data: { score },
        });
      });

      if (updates.length > 0) {
        await prisma.$transaction(updates);
      }

    return this.getTestAdmin(testId);
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

  // ===== SCORE =====
async getScoreOfQuestion(testId, questionId) {
  const response = await prisma.testResponse.findFirst({
    where: {
      testId,
      questionId
    },
    select: { score: true }
  });

  return response?.score ?? 0;
}

async getScoreOfTest(testId) {
  const responses = await prisma.testResponse.findMany({
    where: { testId },
    select: { score: true }
  });

  return responses.reduce((sum, r) => sum + (r.score || 0), 0);
}

}

export default new TestModel();
