import pkg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:7w6JpUnG5jDeNaohKNACO9@localhost:5432/jewelry_db?schema=public',
});

const email = 'admin@junipiercer.com';
const password = 'juni@2026';
const hash = await bcrypt.hash(password, 10);

try {
  // Create tables if not exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      "passwordHash" TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'USER',
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // Upsert admin user
  const { v4: uuidv4 } = await import('uuid');
  await pool.query(`
    INSERT INTO "User" (id, name, email, "passwordHash", role, "updatedAt")
    VALUES ($1, 'Admin Juni', $2, $3, 'ADMIN', NOW())
    ON CONFLICT (email) DO UPDATE SET "passwordHash" = $3, "updatedAt" = NOW()
  `, [uuidv4(), email, hash]);

  console.log('✅ Admin user created/updated successfully!');
  console.log('📧 Email:', email);
  console.log('🔑 Password:', password);
} catch (err) {
  console.error('❌ Error:', err.message);
} finally {
  await pool.end();
}
