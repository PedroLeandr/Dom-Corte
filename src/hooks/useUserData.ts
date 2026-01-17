import { useState, useEffect } from 'react'

interface UserData {
  name: string
  phone: string
}

const STORAGE_KEY = 'userData'

export function useUserData() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    phone: ''
  })

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUserData(parsed)
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
      }
    }
  }, [])

  // Salvar dados no localStorage
  const saveUserData = (data: UserData) => {
    setUserData(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  // Atualizar apenas um campo
  const updateField = (field: keyof UserData, value: string) => {
    const newData = { ...userData, [field]: value }
    saveUserData(newData)
  }

  return {
    userData,
    saveUserData,
    updateField
  }
}
