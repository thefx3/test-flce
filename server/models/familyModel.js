//familyeModel.js
import prisma from "../prisma/prisma.js";

const baseFamilySelect = {
    familyId: true, 
    userId: true,
    familyname1: true,
    familyname2: true,
    email: true,
    phone: true,
    address: true
};

class FamilyModel {

async createFamily(userId, data) {
  return await prisma.auPairFamily.create({
      data: {
          userId,
          familyname1: data.familyname1,
          familyname2: data.familyname2 ?? null,
          email: data.email,
          phone: data.phone,
          address: data.address ?? null
      },
      select: baseFamilySelect
  });
}

async getAllFamilies() {
  return await prisma.auPairFamily.findMany({
      select: baseFamilySelect
  })
}

async getSingleFamily(userId) {
  return await prisma.auPairFamily.findMany({
      where: { userId },
      select: baseFamilySelect
  })
}

async updateFamily(userId, data) {
  return await prisma.auPairFamily.update({
      where: { userId },
      data,
      select: baseFamilySelect
  })
}

async deleteFamily (userId) {
  return await prisma.auPairFamily.delete({
      where: { userId },
  });
}

}
export default new FamilyModel();
