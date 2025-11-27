// models/questionModel.js
import prisma from "../prisma/prisma.js";

const adminQuestionSelect = {
  questionId: true,
  type: true,
  text: true,
  mediaUrl: true,
  correctBool: true,
  correctText: true,
  points: true,
  order: true,
};

const publicQuestionSelect = {
  questionId: true,
  type: true,
  text: true,
  mediaUrl: true,
  order: true,
};

class QuestionModel {

//Public
async getAllQuestionsPublic() {
  return prisma.question.findMany({
    orderBy: { order: "asc" },
    select: publicQuestionSelect,
  });
}

async getSingleQuestionPublic(questionId) {
  return prisma.question.findUnique({
    where: { questionId: Number(questionId) },
    select: publicQuestionSelect,
  })
}

//Admin
async getAllQuestionsAdmin() {
  return prisma.question.findMany({
    orderBy: { order: "asc" },
    select: adminQuestionSelect,
  });
}

async getSingleQuestionAdmin(questionId) {
  return prisma.question.findUnique({
    where: { questionId: Number(questionId) },
    select: adminQuestionSelect,
  });
}

async createQuestion(data) {
  return prisma.question.create({
    data: {
      type: data.type,
      text: data.text,
      mediaUrl: data.mediaUrl ?? null,
      correctBool: data.correctBool ?? null,
      correctText: data.correctText ?? null,
      points: data.points ?? 1,
      order: data.order,
    },
    select: adminQuestionSelect,
  });
}

async updateQuestion(questionId, data) {
  return prisma.question.update({
    where: { questionId: Number(questionId) },
    data,
    select: adminQuestionSelect,
  });
}

async deleteQuestion(questionId) {
  return prisma.question.delete({
    where: { questionId: Number(questionId) },
    select: adminQuestionSelect,
  });
}

}

export default new QuestionModel();
