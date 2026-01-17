// Função para enviar notificação via Telegram API (sem biblioteca externa)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID_LIMA = process.env.TELEGRAM_CHAT_LIMA_ID
const TELEGRAM_CHAT_ID_RUTE = process.env.TELEGRAM_CHAT_RUTE_ID

interface BookingNotification {
  clientName: string
  clientPhone: string
  barberName: string
  serviceName: string
  date: string
  startTime: string
  endTime: string
}

export async function sendBookingNotification(booking: BookingNotification): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('[Telegram] Bot não configurado. Pulando notificação.')
    return
  }

  // Determinar qual chat ID usar baseado no barbeiro
  const barberNameLower = booking.barberName.toLowerCase()
  let chatId: string | undefined
  let barberDisplayName: string

  if (barberNameLower.includes('lima')) {
    chatId = TELEGRAM_CHAT_ID_LIMA
    barberDisplayName = 'Lima'
  } else if (barberNameLower.includes('rute')) {
    chatId = TELEGRAM_CHAT_ID_RUTE
    barberDisplayName = 'Rute'
  }

  if (!chatId) {
    console.warn(`[Telegram] Chat ID não configurado para o barbeiro: ${booking.barberName}`)
    return
  }

  try {
    const message = `
🔔 *Nova Marcação para ${barberDisplayName}*

👤 *Cliente:* ${booking.clientName}
📱 *Telefone:* ${booking.clientPhone}
💈 *Barbeiro:* ${booking.barberName}
✂️ *Serviço:* ${booking.serviceName}
📅 *Data:* ${formatDate(booking.date)}
🕐 *Horário:* ${booking.startTime} - ${booking.endTime}
    `.trim()

    // Enviar mensagem usando a API HTTP do Telegram
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.description || 'Erro ao enviar mensagem')
    }

    console.log(`[Telegram] Notificação enviada com sucesso para ${barberDisplayName}`)
  } catch (error) {
    console.error('[Telegram] Erro ao enviar notificação:', error)
    // Não lançar erro para não quebrar o fluxo de agendamento
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
