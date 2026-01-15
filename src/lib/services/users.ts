import { hash } from "bcryptjs";
import { prisma } from "../prisma";

const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;

export async function createUser(email: string, password: string) {
  if (!email) {
    throw new Error("Email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error("Password must be at least 8 characters");
  }

  const passwordHash = await hash(password, SALT_ROUNDS);

  return prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

interface UpdateUserData {
  email?: string;
  password?: string;
}

export async function updateUser(id: string, data: UpdateUserData) {
  const updateData: { email?: string; passwordHash?: string } = {};

  if (data.email) {
    updateData.email = data.email;
  }

  if (data.password) {
    updateData.passwordHash = await hash(data.password, SALT_ROUNDS);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}
