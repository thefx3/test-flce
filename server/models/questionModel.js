// models/questionModel.js
import prisma from "../prisma/prisma.js";

const videoSelect = { videoId: true, url: true, title: true };

const adminQuestionSelect = {
  questionId: true,
  type: true,
  text: true,
  choices: true,
  correctBool: true,
  correctText: true,
  points: true,
  order: true,
  videoId: true,
  video: { select: videoSelect },
};

const publicQuestionSelect = {
  questionId: true,
  type: true,
  text: true,
  choices: true,
  order: true,
  videoId: true,
  video: { select: videoSelect },
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

class QuestionModel {

//Public
async getQuestionsQCMPublic(){
  return prisma.question.findMany({
    where: { type: "QCM", videoId: null },
    orderBy: { order: "asc" },
    select: publicQuestionSelect,
  });
}

async getQuestionsVIDEOPublic(){
  return prisma.question.findMany({
    where: { videoId: { not: null } },
    orderBy: { order: "asc" },
    select: publicQuestionSelect,
  });
}

async getQuestionsOPENPublic(){
  return prisma.question.findMany({
    where: { type: "OPEN", videoId: null },
    orderBy: { order: "asc" },
    select: publicQuestionSelect,
  });
}

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

// Alias for clarity in controllers
async getQuestionByIdPublic(questionId) {
  return this.getSingleQuestionPublic(questionId);
}

//Admin
async getQuestionsQCMAdmin(){
  return prisma.question.findMany({
    where: { type: "QCM" },
    orderBy: { order: "asc" },
    select: adminQuestionSelect,
  });
}

async getQuestionsVIDEOAdmin(){
  return prisma.question.findMany({
    where: { videoId: { not: null } },
    orderBy: { order: "asc" },
    select: adminQuestionSelect,
  });
}

async getQuestionsOPENAdmin(){
  return prisma.question.findMany({
    where: { type: "OPEN" },
    orderBy: { order: "asc" },
    select: adminQuestionSelect,
  });
}

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
      choices: data.choices ?? [],
      correctBool: data.correctBool ?? null,
      correctText: data.correctText ?? null,
      points: data.points ?? 1,
      order: Number(data.order),
      videoId: data.videoId ?? null,
    },
    select: adminQuestionSelect,
  });
}

async updateQuestion(questionId, data) {
  const allowedFields = [
    "type",
    "text",
    "choices",
    "correctBool",
    "correctText",
    "points",
    "order",
    "videoId",
  ];

  const safeData = pickAllowedFields(data, allowedFields);

  return prisma.question.update({
    where: { questionId: Number(questionId) },
    data: safeData,
    select: adminQuestionSelect,
  });
}

async deleteQuestion(questionId) {
  return prisma.question.delete({
    where: { questionId: Number(questionId) },
    select: adminQuestionSelect,
  });
}

async getScoreOfQuestion(testId, questionId) {
  const response = await prisma.testResponse.findFirst({
    where: { testId, questionId },
    select: { score: true }
  });

  return response?.score ?? 0;
}

}

export default new QuestionModel();
