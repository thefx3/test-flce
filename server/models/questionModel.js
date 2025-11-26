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

  //Public
  async getAllPublic() {
    return prisma.question.findMany({
      orderBy: { order: "asc" },
      select: publicQuestionSelect
    });
  }

  async getByIdPublic(id) {
    return prisma.question.findUnique({
      where: { questionId: id },
      select: publicQuestionSelect
    });
  }

  //Admin
  async getAllAdmin() {
    return prisma.question.findMany({
      orderBy: { order: "asc" },
      select: baseQuestionSelect
    });
  }

  async getByIdAdmin(id) {
    return prisma.question.findUnique({
      where: { questionId: id },
      select: baseQuestionSelect
    });
  }


  //Admin
  async createQuestion(data) {
    return prisma.question.create({
      data,
      select: baseQuestionSelect
    });
  }

  async updateQuestion(id, data) {
    return prisma.question.update({
      where: { questionId: id },
      data,
      select: baseQuestionSelect
    });
  }

  async deleteQuestion(id) {
    return prisma.question.delete({
      where: { questionId: id },
      select: baseQuestionSelect
    });
  }
}

export default new QuestionModel();
