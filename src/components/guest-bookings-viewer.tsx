"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, User, Scissors, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GuestBooking {
  id: string
  clientName: string
  clientPhone: string
  serviceName: string
  barberName: string
  date: string
  startTime: string
  createdAt: string
  barberId: string
  serviceId: string
}

export function GuestBookingsViewer() {
  const [bookings, setBookings] = useState<GuestBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ clientName: '', clientPhone: '' })

  useEffect(() => {
    loadGuestBookings()
  }, [])

  const loadGuestBookings = async () => {
    try {
      const guestUserId = localStorage.getItem('guestUserId')
      if (!guestUserId) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/bookings?userId=${guestUserId}`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta marcação?')) {
      return
    }

    try {
      const guestUserId = localStorage.getItem('guestUserId')
      const response = await fetch(`/api/bookings?bookingId=${bookingId}&userId=${guestUserId}`, {
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

  const startEdit = (booking: GuestBooking) => {
    setEditingId(booking.id)
    setEditForm({
      clientName: booking.clientName,
      clientPhone: booking.clientPhone
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ clientName: '', clientPhone: '' })
  }

  const handleUpdate = async (bookingId: string) => {
    try {
      const guestUserId = localStorage.getItem('guestUserId')
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          userId: guestUserId,
          clientName: editForm.clientName,
          clientPhone: editForm.clientPhone
        })
      })

      if (response.ok) {
        await loadGuestBookings()
        setEditingId(null)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-lg p-6">
        <p className="text-gray-300">Carregando agendamentos...</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-lg p-6 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Nenhum agendamento encontrado</h3>
        <p className="text-gray-400 mb-4">Você ainda não fez nenhum agendamento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Seus Agendamentos</h2>
      
      {bookings.map((booking) => {
        const isEditing = editingId === booking.id
        
        return (
          <div key={booking.id} className="bg-neutral-800 rounded-lg p-6">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                  <input
                    type="text"
                    value={editForm.clientName}
                    onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={editForm.clientPhone}
                    onChange={(e) => setEditForm({ ...editForm, clientPhone: e.target.value })}
                    className="w-full bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdate(booking.id)}
                    size="sm"
                  >
                    Salvar
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{booking.serviceName}</h3>
                    <p className="text-gray-400">com {booking.barberName}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-gray-300 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(booking.startTime)}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatTime(booking.startTime)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-neutral-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <User className="w-4 h-4 mr-2" />
                      <span>{booking.clientName}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEdit(booking)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(booking.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}