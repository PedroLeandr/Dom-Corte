import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const barberId = searchParams.get('barberId')
    const date = searchParams.get('date')
    
    if (!barberId || !date) {
      return NextResponse.json(
        { error: 'barberId e date são obrigatórios' },
        { status: 400 }
      )
    }
    
    // Buscar todas as marcações do barbeiro na data especificada
    const bookings = await sql`
      SELECT start_time, end_time, service_id
      FROM bookings
      WHERE barber_id = ${barberId}
      AND date = ${date}
      ORDER BY start_time
    `
    
    // Formatar os dados para o formato esperado pelo frontend
    const occupiedSlots = bookings.map((booking: any) => {
      const startTime = new Date(booking.start_time)
      const endTime = new Date(booking.end_time)
      
      // Calcular duração em minutos
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
      
      return {
        start: startTime.toTimeString().slice(0, 5), // HH:MM
        duration: duration
      }
    })
    
    return NextResponse.json({ occupiedSlots })
    
  } catch (error) {
    console.error('[Available Slots] Erro ao buscar horários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
