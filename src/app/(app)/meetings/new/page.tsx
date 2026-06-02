"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMeetingFlow } from "@/components/meeting/meeting-context"

export default function NewMeetingPage() {
  const router = useRouter()
  const { meetingForm, setMeetingForm } = useMeetingFlow()
  
  const [title, setTitle] = useState(meetingForm?.title || "")
  const [date, setDate] = useState(meetingForm?.date || new Date().toISOString().split("T")[0])
  const [participants, setParticipants] = useState(meetingForm?.participants || "")
  const [agenda, setAgenda] = useState(meetingForm?.agenda || "")

  const handleNext = () => {
    if (!title) return
    
    setMeetingForm({
      ...meetingForm,
      title,
      date,
      participants,
      agenda
    })
    
    // In a real app we would create the meeting in the database here
    // and get a meeting ID, but for now we'll just go to a dummy route
    router.push("/meetings/draft-1/record")
  }

  return (
    <div className="p-8 md:p-10 max-w-3xl mx-auto w-full">
      <button 
        onClick={() => router.push("/dashboard")} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium mb-8"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to dashboard
      </button>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Create New Meeting</h2>
        <p className="text-[14px] text-slate-500 mt-1.5">Set up your meeting details before recording or uploading audio.</p>
      </div>

      <div className="space-y-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Meeting Title <span className="text-red-500">*</span></label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Q2 Sprint Planning"
            className="h-12 px-4 rounded-xl text-[14px] border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Date</label>
          <Input 
            type="date"
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="h-12 px-4 rounded-xl text-[14px] border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Participants</label>
          <Input 
            value={participants} 
            onChange={(e) => setParticipants(e.target.value)} 
            placeholder="e.g. Aryan, Priya, Rahul"
            className="h-12 px-4 rounded-xl text-[14px] border-slate-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Agenda / Description</label>
          <Textarea 
            value={agenda} 
            onChange={(e) => setAgenda(e.target.value)} 
            placeholder="What topics will be covered?"
            className="min-h-[120px] p-4 rounded-xl text-[14px] border-slate-200 resize-y"
          />
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleNext} 
            disabled={!title}
            className="h-12 px-8 rounded-xl font-semibold shadow-sm w-full sm:w-auto"
          >
            Continue to Audio
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
