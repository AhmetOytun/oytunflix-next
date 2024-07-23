"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const mainPage = () => {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("X-Auth-Token")
        if (token) {
            router.push("/library")
        }
    }
    , [])
  return (
    <div className="bg-gradient-to-b from-gray-400 to-gray-800 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl mb-8 font-bold text-gray-100">Oytunflix</h1>
      <div className="flex flex-row gap-12">
        <Link href="/login" className="text-blue-200 hover:underline">Login</Link>
        <Link href="/register" className="text-blue-200 hover:underline">Register</Link>
      </div>
    </div>
  )
}

export default mainPage
