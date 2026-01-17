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
  let barberDisplayName: string = booking.barberName // Inicializar com valor padrão

  if (barberNameLower.includes('lima')) {
    chatId = TELEGRAM_CHAT_ID_LIMA
    barberDisplayName = 'Lima'
  } else if (barberNameLower.includes('rute')) {
    chatId = TELEGRAM_CHAT_ID_RUTE
    barberDisplayName = 'Rute'
  } else {
    // Se não for Lima nem Rute, não enviar notificação
    console.warn(`[Telegram] Chat ID não configurado para o barbeiro: ${booking.barberName}`)
    return
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

export async function sendCancellationNotification(booking: BookingNotification): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('[Telegram] Bot não configurado. Pulando notificação.')
    return
  }

  const barberNameLower = booking.barberName.toLowerCase()
  let chatId: string | undefined
  let barberDisplayName: string = booking.barberName

  if (barberNameLower.includes('lima')) {
    chatId = TELEGRAM_CHAT_ID_LIMA
    barberDisplayName = 'Lima'
  } else if (barberNameLower.includes('rute')) {
    chatId = TELEGRAM_CHAT_ID_RUTE
    barberDisplayName = 'Rute'
  } else {
    console.warn(`[Telegram] Chat ID não configurado para o barbeiro: ${booking.barberName}`)
    return
  }

  if (!chatId) {
    console.warn(`[Telegram] Chat ID não configurado para o barbeiro: ${booking.barberName}`)
    return
  }

  try {
    const message = `
❌ *Marcação Cancelada - ${barberDisplayName}*

👤 *Cliente:* ${booking.clientName}
📱 *Telefone:* ${booking.clientPhone}
💈 *Barbeiro:* ${booking.barberName}
✂️ *Serviço:* ${booking.serviceName}
📅 *Data:* ${formatDate(booking.date)}
🕐 *Horário:* ${booking.startTime} - ${booking.endTime}
    `.trim()

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

    console.log(`[Telegram] Notificação de cancelamento enviada para ${barberDisplayName}`)
  } catch (error) {
    console.error('[Telegram] Erro ao enviar notificação de cancelamento:', error)
  }
}

export async function sendModificationNotification(
  oldBooking: BookingNotification,
  newBooking: BookingNotification
): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('[Telegram] Bot não configurado. Pulando notificação.')
    return
  }

  const barberNameLower = newBooking.barberName.toLowerCase()
  let chatId: string | undefined
  let barberDisplayName: string = newBooking.barberName

  if (barberNameLower.includes('lima')) {
    chatId = TELEGRAM_CHAT_ID_LIMA
    barberDisplayName = 'Lima'
  } else if (barberNameLower.includes('rute')) {
    chatId = TELEGRAM_CHAT_ID_RUTE
    barberDisplayName = 'Rute'
  } else {
    console.warn(`[Telegram] Chat ID não configurado para o barbeiro: ${newBooking.barberName}`)
    return
  }

  if (!chatId) {
    console.warn(`[Telegram] Chat ID não configurado para o barbeiro: ${newBooking.barberName}`)
    return
  }

  try {
    // Construir mensagem mostrando as mudanças
    let changes = []
    
    if (oldBooking.clientName !== newBooking.clientName) {
      changes.push(`👤 *Cliente:* ${oldBooking.clientName} → ${newBooking.clientName}`)
    }
    if (oldBooking.clientPhone !== newBooking.clientPhone) {
      changes.push(`📱 *Telefone:* ${oldBooking.clientPhone} → ${newBooking.clientPhone}`)
    }
    if (oldBooking.date !== newBooking.date) {
      changes.push(`📅 *Data:* ${formatDate(oldBooking.date)} → ${formatDate(newBooking.date)}`)
    }
    if (oldBooking.startTime !== newBooking.startTime || oldBooking.endTime !== newBooking.endTime) {
      changes.push(`🕐 *Horário:* ${oldBooking.startTime}-${oldBooking.endTime} → ${newBooking.startTime}-${newBooking.endTime}`)
    }
    if (oldBooking.serviceName !== newBooking.serviceName) {
      changes.push(`✂️ *Serviço:* ${oldBooking.serviceName} → ${newBooking.serviceName}`)
    }

    const changesText = changes.length > 0 ? changes.join('\n') : 'Sem alterações detectadas'

    const message = `
✏️ *Marcação Modificada - ${barberDisplayName}*

${changesText}

*Dados Atuais:*
👤 *Cliente:* ${newBooking.clientName}
📱 *Telefone:* ${newBooking.clientPhone}
💈 *Barbeiro:* ${newBooking.barberName}
✂️ *Serviço:* ${newBooking.serviceName}
📅 *Data:* ${formatDate(newBooking.date)}
🕐 *Horário:* ${newBooking.startTime} - ${newBooking.endTime}
    `.trim()

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

    console.log(`[Telegram] Notificação de modificação enviada para ${barberDisplayName}`)
  } catch (error) {
    console.error('[Telegram] Erro ao enviar notificação de modificação:', error)
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
