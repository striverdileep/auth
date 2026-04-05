"use server";

import { getUserByEmail } from "@/utils/getUser";
import { db } from "@lib/db";
import bcrypt from "bcrypt";

export async function register(
  username: string,
  password: string,
  email: string,
): Promise<{ error?: string; success?: string } | void> {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "User with this email already exists" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });
    return { success: "User registered successfully" };
  } catch (error) {
    console.error("Error creating Account");
  }
}
