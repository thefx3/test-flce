// questionModel.js
import prisma from "../prisma/prisma.js";

const baseQuestionSelect = {
  id: true,
  type: true,
  text: true,
  mediaUrl: true,
  correctBool: true,
  correctText: true,
  points: true,
  order: true
};

const publicQuestionSelect = {
  id: true,
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
      where: { id },
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
      where: { id },
      select: baseQuestionSelect
    });
  }


  //Admin
  async create(data) {
    return prisma.question.create({
      data,
      select: baseQuestionSelect
    });
  }

  async update(id, data) {
    return prisma.question.update({
      where: { id },
      data,
      select: baseQuestionSelect
    });
  }

  async delete(id) {
    return prisma.question.delete({
      where: { id },
      select: baseQuestionSelect
    });
  }
}

export default new QuestionModel();
