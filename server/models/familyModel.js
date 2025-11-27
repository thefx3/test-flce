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

// =============== TEST USER ACCOUNTS ==================
// All people who are taking the test and are Au Pair

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

  async getFamilyByUserId(userId) {
    return await prisma.auPairFamily.findMany({
        where: { userId: userId },
        select: baseFamilySelect
    })
  }

  async updateFamily(familyId, data) {
    return await prisma.auPairFamily.update({
        where: { familyId },
        data,
        select: baseFamilySelect
    })
  }

  async deleteFamiliesByUserId (userId) {
    return await prisma.auPairFamily.deleteMany({
        where: { userId: userId },
    });
  }

}
export default new FamilyModel();
