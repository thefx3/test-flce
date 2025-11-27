//userModels.js
import prisma from "../prisma/prisma.js";

const baseUserSelect = {
  userId: true,
  email: true,
  name: true,
  lastname: true,
  role: true,
  aupair: true,
  createdAt: true
};

const authUserSelect = {
  ...baseUserSelect,
  password: true,
};

class UserModel {
// ================= ADMIN ACCOUNTS ===================
// NEED user.role = "ADMIN" or user.role = "SUPERADMIN"

async getAdmins() {
  return prisma.user.findMany({
    where: {
      OR: [{ role: "ADMIN" }, { role: "SUPERADMIN" }]
    },
    select: baseUserSelect
  });
}

async getSingleAdminById(userId) {
  return prisma.user.findUnique({
    where: { userId },
    select: baseUserSelect
  });
}

async getSingleAdminByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: authUserSelect
  });
}

async createAdmin(data) {
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name ?? null,
      lastname: data.lastname ?? null,
      password: data.password,
      role: data.role ?? "ADMIN",
      aupair: data.aupair ?? false,
    },
    select: baseUserSelect
  });
}

async updateAdmin(userId, data) {
  const allowedAdminFields = ["email", "name", "lastname", "password", "aupair", "role"];

  const safeData = pickAllowedFields(data, allowedAdminFields);

  return prisma.user.update({
    where: { userId },
    data: safeData,
    select: baseUserSelect
  });
}

// ================= USER ACCOUNTS ===================
// NEED user.role = "ADMIN" or user.role = "SUPERADMIN"

async createTestUser(data) {
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name ?? null,
      lastname: data.lastname ?? null,
      role: "USER",
      aupair: data.aupair ?? false
    },
    select: baseUserSelect
  });
}

async getAllUsers() {
  return prisma.user.findMany({
    where: { role : "USER" },
    select: baseUserSelect
  });
}

async getSingleUserById(userId) {
  return prisma.user.findUnique({
    where: { userId },
    select: baseUserSelect
  });
}

async getSingleUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: baseUserSelect,
  });
}

async updateUser(userId, data) {
  const allowedUserFields = ["email", "name", "lastname", "aupair"];

  const safeData = pickAllowedFields(data, allowedUserFields);

  return prisma.user.update({
    where: { userId },
    data: safeData,
    select: baseUserSelect
  });
}

async deleteUserById(userId) {
  return prisma.user.delete({ where: { userId} });
}

}

export default new UserModel();
