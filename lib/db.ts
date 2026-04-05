import { PrismaClient } from "@generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { readFileSync } from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

declare global {
  var db: PrismaClient | undefined;
}

// Parse DATABASE_URL to extract connection details
const databaseUrl = process.env.DATABASE_URL || "";
const url = new URL(databaseUrl);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: url.port ? parseInt(url.port) : 3306,
  user: url.username,
  password: url.password,
  database: url.pathname?.slice(1),
  connectionLimit: 5,
  ...(url.searchParams.get("ssl-mode") === "REQUIRED" && {
    ssl: {
      ca: readFileSync(path.join(process.cwd(), "ca.pem"), "utf8"),
    },
  }),
});

export const db =
  globalThis.db ||
  new PrismaClient({
    adapter,
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}
