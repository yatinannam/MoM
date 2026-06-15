import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-semibold dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          {status}
        </Badge>
      )
    case "processing":
    case "transcribing":
    case "summarizing":
      return (
        <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-none font-semibold dark:bg-amber-500/15 dark:text-amber-400 dark:hover:bg-amber-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
          {status}
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-100 border-none font-semibold dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
          {status}
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-slate-500 font-semibold border-slate-200 dark:border-slate-700 dark:text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
          {status || "unknown"}
        </Badge>
      )
  }
}
