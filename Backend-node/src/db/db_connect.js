import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    url: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
