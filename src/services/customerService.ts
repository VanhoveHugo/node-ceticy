import { prisma } from "../prisma/client";

export const customerServiceCreate = async (email: string, password: string) => {
  try {
    return prisma.user.create({
      data: {
        email,
        password,
      },
    });
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
};

export const customerServiceFindById = async (id: number) => {
  try {
    return prisma.user.findUnique({
    where: {
      id,
    },
    });
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
}