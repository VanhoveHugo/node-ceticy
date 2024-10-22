import { prisma } from "../prisma/client";

export const friendsServiceCreate = async (userId1: number, userId2: number) => {
  try {
    return prisma.friend.create({
      data: {
        user1Id: userId1,
        user2Id: userId2,
      },
    });
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
};

export const friendsServiceFindByIds = async (userId1: number, userId2: number) => {
  try {
    return prisma.friend.findFirst({
      where: {
        user1Id: userId1,
        user2Id: userId2,
      },
    });
  } catch (error: string | unknown) {
    console.error("Error during user registration:", error);
  }
};
