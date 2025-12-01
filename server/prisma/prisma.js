// prisma/prisma.js
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

// Re-use a single pool/prisma instance in dev to avoid exhausting connections with nodemon reloads
const globalForPrisma = globalThis;

const baseUrl = process.env.DATABASE_URL;
const poolSize = Number(process.env.PG_POOL_SIZE || 5);
const connectionString = baseUrl;

const pool = new Pool({
  connectionString,
  max: poolSize,
  idleTimeoutMillis: 10_000,
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pgPool = pool;
}

export default prisma;
