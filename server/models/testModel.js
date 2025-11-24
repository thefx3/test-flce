// testModel.js
import prisma from "../prisma/prisma.js";

const responseSelect = {
  id: true,
  questionId: true,
  answerBool: true,
  answerText: true,
  score: true,
};

const testSelect = {
  id: true,
  userId: true,
  testresponse: {
    select: responseSelect,
  },
};

//Initial answers 
const initialBooleans = {
  pa1: false, pa2: false, pa3: false, pa4: false, pa5: false,
  pa6: false, pa7: false, pa8: false, pa9: false, pa10: false,
  pa11: false, pa12: false, pa13: false, pa14: false, pa15: false,
  pa16: false, pa17: false, pa18: false, pa19: false, pa20: false,

  pb1: false, pb2: false, pb4: false, pb5: false, pb6: false, pb7: false,
};

const initialStrings = {
  pc1: "", pc2: "", pc3: "", pc4: "", pc5: "", pc6: "", pc7: "",
};

const initialScores = {
//20 questions
  notea1: 0, notea2: 0, notea3: 0, notea4: 0, notea5: 0,
  notea6: 0, notea7: 0, notea8: 0, notea9: 0, notea10: 0,
  notea11: 0, notea12: 0, notea13: 0, notea14: 0, notea15: 0,
  notea16: 0, notea17: 0, notea18: 0, notea19: 0, notea20: 0,

//7 questions video
  noteb1: 0, noteb2: 0, noteb4: 0, noteb5: 0, noteb6: 0, noteb7: 0,

//7 open questions
  notec1: 0, notec2: 0, notec3: 0, notec4: 0, notec5: 0, notec6: 0, notec7: 0,
};

class TestModel {

  //---------------------------------------------------------
  // 1. Create a new test for a user
  //---------------------------------------------------------
  async createTest(userId) {
    return prisma.test.create({
      data: {
        userId,
        ...initialBooleans,
        ...initialStrings,
        ...initialScores,
      },
      select: testSelect,
    });
  }

  //---------------------------------------------------------
  // 2. Get full test with responses
  //---------------------------------------------------------
  async getTestById(id) {
    const test = await prisma.test.findUnique({
      where: { id },
      select: testSelect,
    });
    return test ? { ...test, responses: test.testresponse } : null;
  }

  async getTestByUserId(userId) {
    const tests = await prisma.test.findMany({
      where: { userId },
      select: testSelect,
    });
    return tests.map((t) => ({ ...t, responses: t.testresponse }));
  }

  //---------------------------------------------------------
  // 3. Record student's answers
  //---------------------------------------------------------
  async submitResponses(testId, responses) {
    // responses = [{ questionId, answerBool, answerText }]
    const createData = responses.map(r => ({
      testId,
      questionId: r.questionId,
      answerBool: r.answerBool ?? null,
      answerText: r.answerText ?? null,
      score: 0 // default
    }));

    return prisma.testResponse.createMany({
      data: createData
    });
  }

  //---------------------------------------------------------
  // 4. Automatic grading (QCM + Video)
  //---------------------------------------------------------
  async gradeAuto(testId) {
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: { testresponse: true },
    });
    if (!test) return null;

    const questionIds = test.testresponse.map((r) => r.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, type: true, correctBool: true },
    });
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    const updates = test.testresponse
      .filter((response) => {
        const q = questionMap.get(response.questionId);
        return q && (q.type === "QCM" || q.type === "VIDEO");
      })
      .map((response) => {
        const q = questionMap.get(response.questionId);
        const score = response.answerBool === q.correctBool ? 1 : 0;
        return prisma.testResponse.update({
          where: { id: response.id },
          data: { score },
        });
      });

    if (updates.length) {
      await prisma.$transaction(updates);
    }

    return this.getTestById(testId);
  }

  //---------------------------------------------------------
  // 5. Manual grading (Open questions)
  //---------------------------------------------------------
  async gradeManual(testId, grades) {
    // grades = [{ responseId, score }]
    const updates = grades.map(g =>
      prisma.testResponse.update({
        where: { id: g.responseId },
        data: { score: g.score }
      })
    );

    if (updates.length) {
      await prisma.$transaction(updates);
    }

    return this.getTestById(testId);
  }
}

export default new TestModel();
