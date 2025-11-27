// questionModel.js
import prisma from "../prisma/prisma.js";

const baseQuestionSelect = {
  questionId: true,
  type: true,
  text: true,
  mediaUrl: true,
  correctBool: true,
  correctText: true,
  points: true,
  order: true
};

const publicQuestionSelect = {
  questionId: true,
  type: true,
  text: true,
  mediaUrl: true,
  order: true
};

class QuestionModel {

//====== QUESTIONS ===============
//Public
async getAllQuestionsPublic() {
    return prisma.question.findMany({
      orderBy: { order: "asc" },
      select: publicQuestionSelect
    });
  
}

async getQuestionByIdPublic(questionId) {
    return prisma.question.findUnique({
      where: { questionId },
      select: publicQuestionSelect
    });
}

//Admin
async getAllQuestionsAdmin() {
    return prisma.question.findMany({
      orderBy: { order: "asc" },
      select: baseQuestionSelect
    });
}

async getQuestionByIdAdmin(questionId) {
    return prisma.question.findUnique({
      where: { questionId },
      select: baseQuestionSelect
    });
}

async createQuestion(data) {
    return prisma.question.create({
      data,
      select: baseQuestionSelect
    });
}

async updateQuestion(questionId, data) {
    return prisma.question.update({
      where: { questionId },
      data,
      select: baseQuestionSelect
    });
}

async deleteQuestion(questionId) {
    return prisma.question.delete({
      where: { questionId },
      select: baseQuestionSelect
    });
}

}

export default new QuestionModel();
