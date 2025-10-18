import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import ws from "ws";
import * as schema from "@shared/schema";

const { Pool: PgPool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Check if using Neon or local PostgreSQL
const isNeon = process.env.DATABASE_URL.includes('neon.tech');

let pool: Pool | InstanceType<typeof PgPool>;
let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzleNode>;

if (isNeon) {
  // Use Neon serverless driver for Neon database
  neonConfig.webSocketConstructor = ws;
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon({ client: pool as Pool, schema });
} else {
  // Use standard node-postgres for local PostgreSQL
  pool = new PgPool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNode({ client: pool, schema });
}

export { pool, db };
