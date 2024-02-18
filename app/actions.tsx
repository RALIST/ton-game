"use server";

import {User} from "@tma.js/sdk";
import {PrismaClient} from "@prisma/client";

export async function upsertUser(user: User | undefined) {
    if (!user) return
    const prisma = new PrismaClient();

    return prisma.user.upsert({
      create: {
        telegram_id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        username: user.username
      },
      update: {},
      where: { telegram_id: user.id}
    })
}
