//userModels.js
import prisma from "../prisma/prisma.js";

//Choose what we want to return - not the password
const baseUserSelect = {
  userId: true, //generated automatically
  email: true,
  name: true,
  lastname: true,
  role: true,
  aupair: true,
  createdAt: true //generated automatically
};

//data: is what we have to put in the entry parameters

const authUserSelect = {
  ...baseUserSelect,
  password: true,
};


class UserModel {

// ================= ADMIN ACCOUNTS ===================
// NEED user.role = "ADMIN" or user.role = "SUPERADMIN"

// Return all admins and superadmins
async getAdmins() {
  return prisma.user.findMany({
    where: {
      OR: [{ role: "ADMIN" }, { role: "SUPERADMIN" }]
    },
    select: baseUserSelect
  });
}

async getSingleAdminById(id) {
  return prisma.user.findUnique({
    where: { userId: id },
    select: baseUserSelect
  });
}

async getSingleAdminByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: authUserSelect
  });
}

// Create an admin or superadmin
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

async updateAdmin(id, data) {
  const allowedAdminFields = ["email", "name", "lastname", "password", "aupair", "role"];

  const safeData = pickAllowedFields(data, allowedAdminFields);

  return prisma.user.update({
    where: { userId: id },
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

async getSingleUserById(id) {
  return prisma.user.findUnique({
    where: { userId: id },
    select: baseUserSelect
  });
}

async getSingleUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: baseUserSelect,
  });
}


async updateUser(id, data) {
  const allowedUserFields = ["email", "name", "lastname", "aupair"];

  const safeData = pickAllowedFields(data, allowedUserFields);

  return prisma.user.update({
    where: { userId: id },
    data: safeData,
    select: baseUserSelect
  });
}


// ================= ALL ACCOUNTS ===================
//FOR USERS AND ADMINS

async deleteUserById(id) {
  return prisma.user.delete({ where: { userId: id } });
}

}

export default new UserModel();
