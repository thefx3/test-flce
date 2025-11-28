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

function toBoolean(value, defaultValue = null) {
  if (value === undefined || value === null || value === "") return defaultValue;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    if (["true", "1", "yes", "y"].includes(lower)) return true;
    if (["false", "0", "no", "n"].includes(lower)) return false;
  }
  return defaultValue;
}

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

// Ensure phone is stored as integer or null even if the frontend sends a string
const phone =
  data.phone === undefined || data.phone === null || data.phone === ""
    ? null
    : Number(data.phone);

const safePhone = Number.isNaN(phone) ? null : phone;

const firstregister = toBoolean(data.firstregister, false);

return await prisma.profile.create({
  data: {
    user: { connect: { userId } },

    civility: data.civility ?? null,
    phone: safePhone,
    birthdate: data.birthdate ? new Date(data.birthdate) : null,
    birthplace: data.birthplace ?? null,
    nationality: data.nationality ?? null,
    photoPath: data.photoPath ?? null,
    firstregister,
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
