//profileModel.js
import prisma from "../prisma/prisma.js";

const baseProfileSelect = {
  profileId: true,
  userId: true,
  civility: true,
  phone: true,
  birthdate: true,
  birthplace: true,
  nationality: true,
  photoPath: true,
  firstregister: true,
  address: true,
  arrivaldate: true,
  level: true
};


class ProfileModel {

  // =============== TEST USER ACCOUNTS ==================
  // All people who are taking the test


  async createProfile(userId, data) {
    const now = new Date();    
    return await prisma.profile.create({
      data: {
        user: { connect: { userId } },
        // Prisma schema uses non-null fields; provide safe defaults
        civility: data.civility ?? "",
        phone: data.phone ?? 0,
        birthdate: data.birthdate ?? now,
        birthplace: data.birthplace ?? "",
        nationality: data.nationality ?? "",
        photoPath: data.photoPath ?? "",
        firstregister: data.firstregister ?? false,
        address: data.address ?? "",
        arrivaldate: data.arrivaldate ?? now,
        level: data.level ?? "",
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

  async updateProfileLevel(userId, level) {
    return await prisma.profile.update({
      where: { userId },
      data: { level },
      select: baseProfileSelect,
    });
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
