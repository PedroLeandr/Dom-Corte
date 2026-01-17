"use client"

import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface SignInProps {
  provider?: string
}

export function SignIn({ provider = "google" }: SignInProps) {
  return (
    <Button 
      onClick={() => signIn(provider)}
      className="w-full"
    >
      Entrar com Google
    </Button>
  )
}

export function SignOut() {
  return (
    <Button 
      onClick={() => signOut()}
      variant="outline"
      className="w-full"
    >
      Sair
    </Button>
  )
}