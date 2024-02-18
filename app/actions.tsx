"use server";

import {User} from "@tma.js/sdk";
import {PrismaClient} from "@prisma/client";

export async function upsertUser(user: User | undefined) {
    if (!user) return null;

    const prisma = new PrismaClient();
    return prisma.user.upsert({
      create: {
        telegramId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      },
      update: {},
      where: { telegramId: user.id}
    })
}
