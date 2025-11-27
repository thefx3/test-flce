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

function pickAllowedFields(source, allowedFields) {
  const safe = {};
  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      safe[key] = source[key];
    }
  }
  return safe;
}

class ProfileModel {

async createProfile(userId, data) {
const now = new Date();    
return await prisma.profile.create({
  data: {
    user: { connect: { userId } },

    civility: data.civility ?? null,
    phone: data.phone ?? null,
    birthdate: data.birthdate ? new Date(data.birthdate) : null,
    birthplace: data.birthplace ?? null,
    nationality: data.nationality ?? null,
    photoPath: data.photoPath ?? null,
    firstregister: data.firstregister ?? false,
    address: data.address ?? null,
    arrivaldate: data.arrivaldate ? new Date(data.arrivaldate) : now,
    level: data.level ?? null,
  },
  select: baseProfileSelect
});
}

async getAllProfiles(){
  return prisma.profile.findMany({
      select: baseProfileSelect
  });
}

async getProfile(userId) {
  return await prisma.profile.findUnique({
    where: { userId },
    select: baseProfileSelect
  })
}

// Alias to keep controllers readable
async getProfileByUserId(userId) {
  return this.getProfile(userId);
}

async updateProfile(userId, data) {
  const allowed = [
    "civility",
    "phone",
    "birthdate",
    "birthplace",
    "nationality",
    "photoPath",
    "firstregister",
    "address",
    "arrivaldate",
    "level",
  ];

  const safeData = pickAllowedFields(data, allowed);

  return await prisma.profile.update({
    where: { userId },
    data: safeData,
    select: baseProfileSelect
  })
}

async deleteProfile(userId) {
  return prisma.profile.delete({ where: { userId } });
}

async updateProfileLevel(userId, level) {
  return await prisma.profile.update({
    where: { userId },
    data: { level },
    select: baseProfileSelect,
  });
}

}
export default new ProfileModel();
