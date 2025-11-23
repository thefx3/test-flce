//userModel.js
import prisma from "../prisma/prisma.js";

class UserModel {
    async createUser(data) {
        return await prisma.user.create({
            data: {
              email: data.email,
              password: data.password, // hash bcrypt
              role: data.role ?? "USER",
              createdAt: new Date()
            },
          });
    }

    async updateUser(id, data) {
        return await prisma.user.update({
            where: { id },
            data: {
              ...(data.email && { email: data.email }),
              ...(data.password && { password: data.password }), // hash bcrypt
              ...(data.role && { role: data.role }),
            },
          });
    }

    async updateUserRole(id, newrole) {
        return await prisma.user.update({
            where: { id: id },
            data: { role: newrole },
          })
    }

    async deleteUser(id) {
      return await prisma.user.delete({
        where: { id: id },
      })
    }

    async getAllUsers() {
      return await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        }
      })
    }

    async getUserByEmail(email) {
      return await prisma.user.findUnique({
        where: { email: email },
      })
    }

    async getUserById(id) {
        return await prisma.user.findUnique({
            where: { id: id },
          })
    }
}

export default new UserModel();

