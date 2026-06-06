import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCards({ meetingsCount, thisMonthCount, completedCount }: { meetingsCount: number, thisMonthCount: number, completedCount: number }) {
  const stats = [
    { label: "Total Meetings", value: meetingsCount, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/15", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "This Month", value: thisMonthCount, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-500/15", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Completed", value: completedCount, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/15", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {stats.map(stat => (
        <Card key={stat.label} className="border-slate-100 dark:border-slate-800 dark:bg-slate-900/80 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-blue-500/5 transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">{stat.label}</span>
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={stat.color}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
