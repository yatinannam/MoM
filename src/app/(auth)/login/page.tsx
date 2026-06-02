"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login for now
    if (email) {
      localStorage.setItem("userEmail", email)
      router.push("/dashboard")
    }
  }

  return (
    <Card className="w-full max-w-[420px] p-8 md:p-10 shadow-2xl border-primary/10">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/20">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">MoM Generator</h1>
        <p className="text-sm text-muted-foreground mt-1.5">AI-powered meeting minutes</p>
      </div>

      <div className="flex bg-muted/50 rounded-xl p-1 mb-7">
        {(["login", "signup"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${tab === t ? "bg-background text-primary font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t === "login" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {tab === "signup" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full name</label>
            <Input type="text" placeholder="Aryan Sharma" className="h-12 px-4 rounded-xl" />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email address</label>
          <Input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" 
            className="h-12 px-4 rounded-xl" 
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <Input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" 
            className="h-12 px-4 rounded-xl" 
            required
          />
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl text-[15px] font-semibold mt-2">
          {tab === "login" ? "Sign In" : "Create Account"}
        </Button>
      </form>

      {tab === "login" && (
        <p className="text-center mt-6 text-sm text-muted-foreground">
          <a href="#" className="text-primary hover:underline underline-offset-4">Forgot password?</a>
        </p>
      )}
    </Card>
  )
}
