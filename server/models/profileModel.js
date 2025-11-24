//profileModel.js
import prisma from "../prisma/prisma.js";

const baseProfileSelect = {
  id: true,
  userId: true,
  civility: true,
  phone: true,
  birthdate: true,
  birthplace: true,
  nationality: true,
  photoPath: true,
  firstregister: true,
  address: true,
  arrivaldate: true
};


class ProfileModel {

  // =============== TEST USER ACCOUNTS ==================
  // All people who are taking the test


  async createProfile(userId, data) {
    return await prisma.profile.create({
      data: {
        userId: userId,
        civility: data.civility,
        phone: data.phone,
        birthdate: data.birthdate,
        birthplace: data.birthplace,
        nationality: data.nationality,
        photoPath: data.photoPath,
        firstregister: data.firstregister,
        address: data.address,
        arrivaldate: data.arrivaldate
      },
      select: baseProfileSelect
    });
  }

  // NEED user.role = "ADMIN" or user.role = "SUPERADMIN"
  async updateProfile(userId, data) {
    return await prisma.profile.update({
      where: { userId: userId },
      data,
      select: baseProfileSelect
    })
  }

  // NEED user.role = "ADMIN" or user.role = "SUPERADMIN"
  async getProfileByUserId(userId) {
    return await prisma.profile.findUnique({
      where: { userId: userId },
      select: baseProfileSelect
    })
  }

}
export default new ProfileModel();

