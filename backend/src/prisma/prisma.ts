// index.ts
// Query your database using the Prisma Client

import 'dotenv/config'
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
/**
 * Check if database connection is active
 * Returns true if connected, false otherwise
 */
export async function isDatabaseConnected(): Promise<boolean> {
  try {
    await prisma.$connect()
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get detailed database connection status
 * Returns object with connection state and optional error message
 */
export async function getDatabaseStatus(): Promise<{ connected: boolean; error?: string }> {
  try {
    await prisma.$connect()
    return { connected: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error'
    return { connected: false, error: errorMessage }
  }
}
