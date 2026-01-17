require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    console.log('Conectando ao Neon PostgreSQL...');
    
    const client = await pool.connect();
    console.log('✅ Conectado ao banco');
    
    console.log('\nAdicionando coluna user_id...');
    await client.query('ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id VARCHAR(255)');
    console.log('✅ Coluna user_id adicionada');
    
    console.log('\nCriando índice...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)');
    console.log('✅ Índice criado');
    
    console.log('\nVerificando coluna...');
    const result = await client.query(
      "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'user_id'"
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Coluna verificada:', result.rows[0]);
    }
    
    client.release();
    await pool.end();
    console.log('\n🎉 Migração concluída com sucesso!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    await pool.end();
    process.exit(1);
  }
}

migrate();
