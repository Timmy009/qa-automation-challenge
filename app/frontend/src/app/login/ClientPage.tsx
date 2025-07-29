"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/Auth/LoginForm"
import { getCurrentUser } from "@/lib/services/auth-service"

export default function ClientPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  )
}
