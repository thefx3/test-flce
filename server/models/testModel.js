// models/testModel.js
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
  responses: {
    select: responseSelect,
  },
};

class TestModel {
  // ----------------------------------------------------
  // 1. Create a new test and auto-create blank responses
  // ----------------------------------------------------
  async createTest(userId) {
    // Create test row
    const test = await prisma.test.create({
      data: { userId },
    });

    // Load all questions
    const questions = await prisma.question.findMany({
      orderBy: { order: "asc" },
    });

    // Create empty responses
    const responsesData = questions.map(q => ({
      testId: test.id,
      questionId: q.id,
      answerBool: null,
      answerText: "",
      score: 0,
    }));

    await prisma.testResponse.createMany({ data: responsesData });

    return this.getTestById(test.id);
  }

  // ----------------------------------------------------
  // 2. Get a test (single or all)
  // ----------------------------------------------------
  async getTestById(id) {
    return prisma.test.findUnique({
      where: { id },
      select: testSelect,
    });
  }

  async getTestsByUser(userId) {
    return prisma.test.findMany({
      where: { userId },
      select: testSelect,
    });
  }

  // ----------------------------------------------------
  // 3. Update answers
  // ----------------------------------------------------
  async submitAnswers(answers) {
    // answers = [{ responseId, answerBool?, answerText? }]
    const updates = answers.map(a =>
      prisma.testResponse.update({
        where: { id: a.responseId },
        data: {
          answerBool: a.answerBool ?? null,
          answerText: a.answerText ?? "",
        },
      })
    );

    await prisma.$transaction(updates);
    return { message: "Responses updated" };
  }

  // ----------------------------------------------------
  // 4. Automatic grading
  // ----------------------------------------------------
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
          where: { id: r.id },
          data: { score },
        });
      });

    await prisma.$transaction(updates);
    return this.getTestById(testId);
  }

  // ----------------------------------------------------
  // 5. Manual grading (only for open questions)
  // ----------------------------------------------------
  async gradeManual(grades) {
    // grades = [{ responseId, score }]
    const updates = grades.map(g =>
      prisma.testResponse.update({
        where: { id: g.responseId },
        data: { score: g.score },
      })
    );

    await prisma.$transaction(updates);
    return { message: "Manual grading updated" };
  }
}

export default new TestModel();
