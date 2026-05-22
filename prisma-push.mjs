// Script para aplicar o schema do Prisma sem o CLI
// Usa o adapter pg diretamente para executar o SQL necessário
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function waitForDb(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ Banco de dados conectado!');
      return;
    } catch (e) {
      console.log(`⏳ Aguardando banco de dados... (${i + 1}/${retries})`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  throw new Error('❌ Não foi possível conectar ao banco de dados.');
}

async function main() {
  await waitForDb();
  
  // Verifica se as tabelas existem, se não, roda prisma db push via node
  const { rows } = await pool.query(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `);

  const tables = rows.map(r => r.tablename);
  console.log('📋 Tabelas existentes:', tables.join(', ') || 'nenhuma');

  if (!tables.includes('User')) {
    console.log('🔧 Criando tabelas via Prisma...');
    const { execSync } = await import('child_process');
    try {
      execSync(`npx prisma db push --url "${process.env.DATABASE_URL}"`, {
        env: { ...process.env },
        stdio: 'inherit',
        cwd: '/app'
      });
      console.log('✅ Schema aplicado com sucesso!');
    } catch (err) {
      console.error('⚠️ Falha no prisma db push, tentando continuar...', err.message);
    }
  } else {
    console.log('✅ Tabelas já existem, pulando migração.');
  }

  // Verifica se o usuário admin já existe, se não, faz auto-seeding
  try {
    const { rows: userRows } = await pool.query('SELECT COUNT(*) FROM "User"');
    const userCount = parseInt(userRows[0].count, 10);
    console.log(`👤 Quantidade de usuários cadastrados: ${userCount}`);

    if (userCount === 0) {
      console.log('🌱 Banco vazio detectado! Realizando auto-seeding do admin...');
      const bcrypt = await import('bcryptjs');
      
      const adminId = '123e4567-e89b-12d3-a456-426614174000';
      const email = 'admin@junipiercer.com';
      const password = 'juni@2026@'; // Padrão solicitado pelo usuário
      const hash = await bcrypt.default.hash(password, 10);

      await pool.query(`
        INSERT INTO "User" (id, name, email, "passwordHash", role, "createdAt", "updatedAt")
        VALUES ($1, 'Juni', $2, $3, 'ADMIN', NOW(), NOW())
        ON CONFLICT (email) DO NOTHING
      `, [adminId, email, hash]);

      console.log('✅ Admin cadastrado com sucesso automaticamente!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Senha: ${password}`);
    }
  } catch (seedErr) {
    console.error('⚠️ Erro ao verificar ou criar usuário admin:', seedErr.message);
  }

  await pool.end();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
