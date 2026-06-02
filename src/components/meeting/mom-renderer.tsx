import React from "react"

export function MomRenderer({ text }: { text: string }) {
  if (!text) return null

  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  
  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (line === "---") {
      elements.push(<hr key={i} className="border-t border-slate-100 my-6" />)
      i++
      continue
    }

    if (line.startsWith("| ")) {
      // Table handling
      const tableRows = []
      let j = i
      while (j < lines.length && lines[j].startsWith("| ")) {
        tableRows.push(lines[j])
        j++
      }
      
      elements.push(
        <div key={i} className="mb-4 overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <tbody>
              {tableRows.map((row, rIdx) => {
                const cells = row.split("|").filter(c => c.trim()).map(c => c.trim())
                if (cells[0].startsWith("---")) return null
                
                const isHeader = rIdx === 0
                return (
                  <tr key={rIdx} className={isHeader ? "bg-slate-50" : "border-b border-slate-50"}>
                    {cells.map((cell, cIdx) => (
                      <td key={cIdx} className={`py-2.5 px-4 ${isHeader ? 'font-semibold text-slate-500' : 'text-slate-700'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
      i = j
      continue
    }

    // Bold starting line (e.g. **Agenda:**)
    const boldMatch = line.match(/^\*\*(.*)\*\*:(.*)$/)
    if (boldMatch) {
      elements.push(
        <p key={i} className="my-2 text-[15px] leading-relaxed text-slate-700">
          <strong className="text-slate-900 font-semibold">{boldMatch[1]}:</strong>{boldMatch[2]}
        </p>
      )
      i++
      continue
    }

    // Inline bold text
    if (line.trim()) {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      elements.push(
        <p key={i} className="my-1.5 text-[15px] leading-relaxed text-slate-700">
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-slate-900 font-semibold">{p}</strong> : p)}
        </p>
      )
    }

    i++
  }

  return <div className="font-sora">{elements}</div>
}
