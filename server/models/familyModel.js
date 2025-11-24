//familyeModel.js
import prisma from "../prisma/prisma.js";

const baseFamilySelect = {
    id: true, 
    userId: true,
    familyname1: true,
    familyname2: true,
    email: true,
    phone: true,
    address: true
}

class FamilyModel {

  // =============== TEST USER ACCOUNTS ==================
  // All people who are taking the test and are Au Pair

  //NEED user.aupair = "TRUE"
  async addFamily(userId, data) {
    return await prisma.auPairFamily.create({
        data: {
            userId: userId,
            familyname1: data.familyname1,
            familyname2: data.familyname2,
            email: data.email,
            phone: data.phone,
            address: data.address
        },
        select: baseFamilySelect
    });
  }

  async listFamilies(userId) {
    return await prisma.auPairFamily.findMany({
        where: { userId: userId },
        select: baseFamilySelect
    })
  }

  async deleteFamiliesByUserId (userId) {
    return await prisma.auPairFamily.deleteMany({
        where: { userId: userId },
        select: baseFamilySelect
    })   
  }

  //Need to delete Family from a known userId
  async deleteFamilyById (id) {
    return await prisma.auPairFamily.delete({
        where: { id: id },
        select: baseFamilySelect
    })
  }

  //Need to update Family from a known userId
  async updateFamily(id, data) {
    return await prisma.auPairFamily.update({
        where: { id: id },
        data,
        select: baseFamilySelect
    })
  }

}
export default new FamilyModel();

