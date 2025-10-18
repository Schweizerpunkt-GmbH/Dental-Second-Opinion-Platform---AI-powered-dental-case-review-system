import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { users } from "../shared/schema";
import { eq } from 'drizzle-orm';

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

async function setupLocalUsers() {
  try {
    console.log('Setting up local development users...\n');

    // 1. Create or update anonymous user
    console.log('1. Checking for anonymous user...');
    const existingAnonymous = await db
      .select()
      .from(users)
      .where(eq(users.id, 'anonymous'));

    if (existingAnonymous.length === 0) {
      await db.insert(users).values({
        id: 'anonymous',
        email: 'anonymous@system.local',
        firstName: 'Anonymous',
        lastName: 'User',
        role: 'PATIENT',
        emailVerified: false,
      });
      console.log('   ✅ Anonymous user created');
    } else {
      console.log('   ✅ Anonymous user already exists');
    }

    // 2. Create or update admin user
    console.log('\n2. Checking for admin user...');
    const adminId = 'local-admin';
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.id, adminId));

    if (existingAdmin.length === 0) {
      await db.insert(users).values({
        id: adminId,
        email: 'admin@localhost.local',
        firstName: 'Local',
        lastName: 'Admin',
        role: 'ADMIN',
        emailVerified: true,
      });
      console.log('   ✅ Admin user created');
      console.log('   📧 Email: admin@localhost.local');
      console.log('   🔑 ID: local-admin');
    } else {
      // Update role to ADMIN if it's not already
      if (existingAdmin[0].role !== 'ADMIN') {
        await db
          .update(users)
          .set({ role: 'ADMIN' })
          .where(eq(users.id, adminId));
        console.log('   ✅ Admin user role updated');
      } else {
        console.log('   ✅ Admin user already exists');
      }
      console.log('   📧 Email:', existingAdmin[0].email);
      console.log('   🔑 ID:', existingAdmin[0].id);
    }

    // 3. Create or update dentist user
    console.log('\n3. Checking for dentist user...');
    const dentistId = 'local-dentist';
    const existingDentist = await db
      .select()
      .from(users)
      .where(eq(users.id, dentistId));

    if (existingDentist.length === 0) {
      await db.insert(users).values({
        id: dentistId,
        email: 'dentist@localhost.local',
        firstName: 'Dr. Local',
        lastName: 'Dentist',
        role: 'DENTIST',
        emailVerified: true,
      });
      console.log('   ✅ Dentist user created');
      console.log('   📧 Email: dentist@localhost.local');
      console.log('   🔑 ID: local-dentist');
    } else {
      // Update role to DENTIST if it's not already
      if (existingDentist[0].role !== 'DENTIST') {
        await db
          .update(users)
          .set({ role: 'DENTIST' })
          .where(eq(users.id, dentistId));
        console.log('   ✅ Dentist user role updated');
      } else {
        console.log('   ✅ Dentist user already exists');
      }
      console.log('   📧 Email:', existingDentist[0].email);
      console.log('   🔑 ID:', existingDentist[0].id);
    }

    console.log('\n✅ Local development users setup complete!\n');
    console.log('Note: Since this app uses Replit Auth, you cannot log in locally.');
    console.log('To test authenticated features, you need to:');
    console.log('  1. Deploy to Replit, or');
    console.log('  2. Implement a local authentication bypass for development\n');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

setupLocalUsers();
