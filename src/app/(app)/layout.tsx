"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { MeetingProvider } from "@/components/meeting/meeting-context"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50/50 font-sora">
      <AppSidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <MeetingProvider>
          {children}
        </MeetingProvider>
      </main>
    </div>
  )
}
