import { Pool } from 'pg'

// Pool configurado para região europeia (baixa latência)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 30000, // 30s (suficiente para Europa)
  query_timeout: 30000 // 30s para queries
})

// Helper que emula sintaxe do Neon serverless (template literals)
export const sql = async (
  strings: TemplateStringsArray | string,
  ...values: any[]
) => {
  // Se for chamado como função normal: sql(query, params)
  if (typeof strings === 'string') {
    const params = values[0] || []
    const retries = 3
    
    for (let i = 0; i < retries; i++) {
      try {
        const result = await pool.query(strings, params)
        return result.rows
      } catch (error: any) {
        const isNetworkError = error.code?.includes('ETIMEDOUT') || 
                              error.code?.includes('ECONNRESET') ||
                              error.code?.includes('ENOTFOUND') ||
                              error.message?.includes('timeout')
        
        if (i === retries - 1 || !isNetworkError) {
          throw error
        }
        
        const delay = 1000 * (i + 1) // 1s, 2s, 3s
        console.log(`[DB] Retry ${i + 1}/${retries} após ${error.code || 'timeout'} (aguardando ${delay}ms)`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    throw new Error('Query failed after 3 retries')
  }
  
  // Se for chamado como template literal: sql`SELECT...`
  // Converte para formato $1, $2, $3
  let query = strings[0]
  for (let i = 0; i < values.length; i++) {
    query += `$${i + 1}` + strings[i + 1]
  }
  
  // Retry logic com mesma estratégia
  for (let i = 0; i < 3; i++) {
    try {
      const result = await pool.query(query, values)
      return result.rows
    } catch (error: any) {
      const isNetworkError = error.code?.includes('ETIMEDOUT') || 
                            error.code?.includes('ECONNRESET') ||
                            error.code?.includes('ENOTFOUND') ||
                            error.message?.includes('timeout')
      
      if (i === 2 || !isNetworkError) {
        throw error
      }
      
      const delay = 1000 * (i + 1) // 1s, 2s, 3s
      console.log(`[DB] Retry ${i + 1}/3 após ${error.code || 'timeout'} (aguardando ${delay}ms)`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new Error('Query failed after 3 retries')
}
