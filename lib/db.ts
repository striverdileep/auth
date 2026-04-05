import { PrismaClient } from "@generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

declare global {
  var db: PrismaClient | undefined | null;
}

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
  ssl: {
    ca: fs.readFileSync("../certs/ca.pem", "utf8"),
  },
});

export const db = globalThis.db || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalThis.db = db;
