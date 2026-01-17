require('dotenv').config()
const { Pool } = require('pg')
const fs = require('fs')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function setup() {
  try {
    console.log('🔗 Conectando à database...')
    console.log('📍 Região: eu-central-1')
    
    console.log('\n📦 Criando schema...')
    const schema = fs.readFileSync('schema.sql', 'utf8')
    
    // Executar cada statement separadamente
    const statements = schema.split(';').filter(s => s.trim())
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement)
      }
    }
    console.log('✅ Schema criado com sucesso!')
    
    console.log('\n🌱 Inserindo dados iniciais...')
    const seed = fs.readFileSync('seed.sql', 'utf8')
    const seedStatements = seed.split(';').filter(s => s.trim())
    for (const statement of seedStatements) {
      if (statement.trim()) {
        await pool.query(statement)
      }
    }
    console.log('✅ Dados inseridos com sucesso!')
    
    console.log('\n🎉 Database configurada!')
  } catch (error) {
    console.error('❌ Erro:', error.message)
    console.error(error)
  } finally {
    await pool.end()
  }
}

setup()
