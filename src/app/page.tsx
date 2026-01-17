import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignIn, SignOut } from "@/components/auth-components";
import { Button } from "@/components/ui/button";
import { GuestBookingButton } from "@/components/guest-booking-button";
import { GuestBookingsViewer } from "@/components/guest-bookings-viewer";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="bg-neutral-800 rounded-lg p-6 max-w-2xl w-full">
        <h1 className="text-xl mb-6 text-center">Barbearia Dom Lima</h1>

        {!session ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="mb-4 text-gray-400">Escolha uma opção para continuar</p>
              
              <GuestBookingButton />
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-neutral-800 px-2 text-gray-400">ou</span>
                </div>
              </div>
              
              <SignIn provider="google" />
            </div>
            
            {/* Mostrar agendamentos guest se existirem */}
            <div className="border-t border-neutral-700 pt-6">
              <GuestBookingsViewer />
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center gap-2">
              {session.user?.image && (
                <Image 
                  src={session.user.image} 
                  alt="User Avatar" 
                  width={64} 
                  height={64} 
                  className="rounded-full"
                />
              )}
              <p className="text-gray-300">Logado como:</p>
              <p className="font-bold">{session.user?.name || session.user?.email}</p>
            </div>
            
            <div className="mt-4">
              <Link href="/marcacao">
                <Button className="w-full mb-2">Agendar agora</Button>
              </Link>
            </div>
            
            <SignOut />
          </div>
        )}
      </div>
    </main>
  );
}