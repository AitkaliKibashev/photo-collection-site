'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useContext, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setUser } = useContext(AuthContext)
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      setUser(res.user)
      router.push('/admin')
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex w-96 flex-col gap-4 rounded-xl bg-white p-6 shadow">
        <h1 className="text-lg font-bold">Admin Login</h1>

        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-destructive">{error}</div>}

        <Button onClick={handleLogin}>Login</Button>
      </div>
    </div>
  )
}
