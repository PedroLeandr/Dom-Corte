"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function GuestBookingButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGuestBooking = async () => {
    setIsLoading(true)
    
    try {
      // Verificar se já existe um usuário guest no localStorage
      let guestUserId = localStorage.getItem('guestUserId')
      
      if (!guestUserId) {
        // Criar um novo usuário guest
        const response = await fetch('/api/guest-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error('Erro ao criar usuário temporário')
        }
        
        const data = await response.json()
        guestUserId = data.userId
        
        // Salvar no localStorage
        if (guestUserId) {
          localStorage.setItem('guestUserId', guestUserId)
        }
      }
      
      // Redirecionar para a página de marcação
      router.push('/marcacao?guest=true')
      
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao iniciar agendamento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleGuestBooking}
      disabled={isLoading}
      className="w-full mb-2"
      variant="outline"
    >
      {isLoading ? 'Carregando...' : 'Agendar sem conta'}
    </Button>
  )
}