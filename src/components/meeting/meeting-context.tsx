"use client"

import React, { createContext, useContext, useState } from "react"
import { type MeetingForm } from "@/lib/types/meeting"

type MeetingContextType = {
  meetingForm: MeetingForm | null
  setMeetingForm: (form: MeetingForm | null) => void
  meetingData: MeetingForm | null
  setMeetingData: (data: MeetingForm | null) => void
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined)

export function MeetingProvider({ children }: { children: React.ReactNode }) {
  const [meetingForm, setMeetingForm] = useState<MeetingForm | null>(null)
  const [meetingData, setMeetingData] = useState<MeetingForm | null>(null)

  return (
    <MeetingContext.Provider
      value={{
        meetingForm,
        setMeetingForm,
        meetingData,
        setMeetingData,
      }}
    >
      {children}
    </MeetingContext.Provider>
  )
}

export function useMeetingFlow() {
  const context = useContext(MeetingContext)
  if (context === undefined) {
    throw new Error("useMeetingFlow must be used within a MeetingProvider")
  }
  return context
}
