import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "./status-badge"

export function MeetingCard({ meeting, onClick }: { meeting: any, onClick: () => void }) {
  return (
    <Card 
      onClick={onClick}
      className="border-slate-100 shadow-sm cursor-pointer hover:-translate-y-[1px] hover:shadow-md transition-all duration-200"
    >
      <CardContent className="p-5 flex justify-between items-start">
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-slate-900">{meeting.title}</h3>
          <p className="text-[13px] text-slate-500 max-w-[80%] line-clamp-1">{meeting.summary}</p>
          <div className="flex gap-4 items-center pt-1.5">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(meeting.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <span className="text-xs text-slate-400">
              {meeting.participants.split(",").length} participants
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2.5">
          <StatusBadge status={meeting.status} />
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-slate-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
