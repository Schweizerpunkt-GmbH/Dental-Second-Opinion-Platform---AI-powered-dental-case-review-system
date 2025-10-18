import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import { users } from "../shared/schema";
import { eq } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

async function createAnonymousUser() {
  try {
    console.log('Checking for anonymous user...');
    
    // Check if anonymous user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, 'anonymous'));
    
    if (existing.length > 0) {
      console.log('✅ Anonymous user already exists');
      process.exit(0);
    }
    
    // Create anonymous user
    await db.insert(users).values({
      id: 'anonymous',
      email: 'anonymous@system.local',
      firstName: 'Anonymous',
      lastName: 'User',
      role: 'PATIENT',
      emailVerified: false,
    });
    
    console.log('✅ Anonymous user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAnonymousUser();
