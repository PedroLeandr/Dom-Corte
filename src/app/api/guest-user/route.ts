import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    console.log('[Guest] Criando usuário guest...')
    
    // Gerar um ID único para o usuário guest
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log('[Guest] ID gerado:', guestId)
    
    // Criar usuário guest na database
    const result = await sql`
      INSERT INTO users (id, name, email) 
      VALUES (${guestId}, ${'Usuário Convidado'}, ${`${guestId}@guest.local`}) 
      RETURNING id
    `
    
    console.log('[Guest] Usuário criado com sucesso:', result[0].id)
    
    return NextResponse.json({ 
      userId: result[0].id,
      message: 'Usuário guest criado com sucesso' 
    })
    
  } catch (error: any) {
    console.error('[Guest] Erro ao criar usuário guest:', error)
    
    // Tratamento específico de erros
    if (error.code?.includes('ETIMEDOUT') || error.message?.includes('timeout')) {
      return NextResponse.json(
        { error: 'Timeout na conexão com o banco de dados. Tente novamente.' },
        { status: 504 }
      )
    }
    
    if (error.code?.includes('ECONNRESET') || error.code?.includes('ENOTFOUND')) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados. Verifique sua rede.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}