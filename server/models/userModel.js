import prisma from "../prisma/prisma.js";

//Choose what we want to return - not the password
const baseUserSelect = {
  id: true, //generated automatically
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
    where: { id },
    select: authUserSelect
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
      password: data.password, // already hashed
      role: data.role ?? "ADMIN",
      aupair: data.aupair ?? false,
    },
    select: baseUserSelect
  });
}

async updateAdmin(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: authUserSelect
  });
}

async deleteAdminByEmail(email) {
  return prisma.user.delete({ where: { email } });
}

async deleteAdminById(id) {
  return prisma.user.delete({ where: { id } });
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
      aupair: data.aupair
    },
    select: baseUserSelect
  });
}

async deleteTestUserByEmail(email) {
  return prisma.user.delete({ where: { email: email } })
}

async deleteTestUserById(id) {
  return prisma.user.delete({ where: { id }  });
}

async getAllUsers() {
  return prisma.user.findMany({
    select: baseUserSelect
  });
}

}

export default new UserModel();
