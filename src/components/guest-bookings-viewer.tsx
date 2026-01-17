"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, User, Scissors } from "lucide-react"
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
}

export function GuestBookingsViewer() {
  const [bookings, setBookings] = useState<GuestBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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

    loadGuestBookings()
  }, [])

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
        <Button>
          Fazer primeiro agendamento
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Seus Agendamentos</h2>
      
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-neutral-800 rounded-lg p-6">
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
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-400">
                <User className="w-4 h-4 mr-2" />
                <span>{booking.clientName}</span>
              </div>
              <span className="text-gray-500">
                Agendado em {new Date(booking.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}