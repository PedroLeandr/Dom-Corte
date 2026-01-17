'use client'

import { useState, useEffect } from 'react'

interface Booking {
  id: string
  clientName: string
  clientPhone: string
  date: string
  startTime: string
  endTime: string
  serviceName: string
  barberName: string
  barberId: string
  serviceId: string
}

export function BookingManager() {
  const [userId, setUserId] = useState<string | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Booking>>({})

  useEffect(() => {
    // Pegar userId do localStorage (pode ser guestUserId ou userId de autenticado)
    const guestId = localStorage.getItem('guestUserId')
    if (guestId) {
      setUserId(guestId)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      loadBookings()
    }
  }, [userId])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/bookings?userId=${userId}`)
      const data = await response.json()
      
      if (response.ok) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Erro ao carregar marcações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta marcação?')) {
      return
    }

    try {
      const response = await fetch(`/api/bookings?bookingId=${bookingId}&userId=${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setBookings(bookings.filter(b => b.id !== bookingId))
        alert('Marcação excluída com sucesso!')
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao excluir marcação')
      }
    } catch (error) {
      console.error('Erro ao excluir marcação:', error)
      alert('Erro ao excluir marcação')
    }
  }

  const startEdit = (booking: Booking) => {
    setEditingId(booking.id)
    setEditForm({
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleUpdate = async (bookingId: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          userId,
          ...editForm
        })
      })

      if (response.ok) {
        await loadBookings()
        setEditingId(null)
        setEditForm({})
        alert('Marcação atualizada com sucesso!')
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao atualizar marcação')
      }
    } catch (error) {
      console.error('Erro ao atualizar marcação:', error)
      alert('Erro ao atualizar marcação')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando marcações...</div>
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Você ainda não tem marcações.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Minhas Marcações</h2>
      
      {bookings.map((booking) => {
        const isEditing = editingId === booking.id
        const date = new Date(booking.date + 'T00:00:00')
        const startTime = new Date(booking.startTime)
        
        return (
          <div key={booking.id} className="border rounded-lg p-4 bg-white shadow-sm">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input
                    type="text"
                    value={editForm.clientName || ''}
                    onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={editForm.clientPhone || ''}
                    onChange={(e) => setEditForm({ ...editForm, clientPhone: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(booking.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{booking.clientName}</h3>
                    <p className="text-gray-600">{booking.clientPhone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(booking)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Data:</span>{' '}
                    {date.toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      day: '2-digit', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p>
                    <span className="font-medium">Horário:</span>{' '}
                    {startTime.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  <p>
                    <span className="font-medium">Barbeiro:</span> {booking.barberName}
                  </p>
                  <p>
                    <span className="font-medium">Serviço:</span> {booking.serviceName}
                  </p>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
