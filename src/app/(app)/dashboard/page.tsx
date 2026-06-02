"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { MeetingCard } from "@/components/dashboard/meeting-card"
import { useMeetingFlow } from "@/components/meeting/meeting-context"
import { MOCK_MEETINGS } from "@/lib/mock-data"

export default function DashboardPage() {
  const router = useRouter()
  const { setMeetingForm } = useMeetingFlow()
  const [search, setSearch] = useState("")

  // Using mock meetings for now. This will be replaced with Supabase data later.
  const [meetings] = useState(MOCK_MEETINGS)

  const filtered = meetings.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.participants.toLowerCase().includes(search.toLowerCase())
  )

  const handleNewMeeting = () => {
    setMeetingForm(null)
    router.push("/meetings/new")
  }

  const handleMeetingClick = (meetingId: number) => {
    router.push(`/meetings/${meetingId}`)
  }

  return (
    <div className="p-8 md:p-10 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Your Meetings</h2>
          <p className="text-[14px] text-slate-500 mt-1">{meetings.length} meeting records saved</p>
        </div>
        <Button onClick={handleNewMeeting} className="h-11 px-5 rounded-xl font-semibold shadow-sm">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Meeting
        </Button>
      </div>

      <StatsCards 
        meetingsCount={meetings.length}
        thisMonthCount={meetings.filter(m => m.date.startsWith("2026-05")).length}
        completedCount={meetings.filter(m => m.status === "completed").length}
      />

      <div className="relative mb-6">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
        <Input 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          placeholder="Search meetings or participants…" 
          className="pl-12 h-12 rounded-xl bg-white border-slate-200 shadow-sm text-[14px]"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map(m => (
          <MeetingCard 
            key={m.id} 
            meeting={m} 
            onClick={() => handleMeetingClick(m.id)} 
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 opacity-50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-[15px] font-medium">No meetings found</p>
        </div>
      )}
    </div>
  )
}
