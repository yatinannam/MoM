import { useState, useRef, useEffect } from "react";

const VIEWS = {
  LOGIN: "login",
  DASHBOARD: "dashboard",
  CREATE: "create",
  RECORD: "record",
  TRANSCRIPT: "transcript",
  SUMMARY: "summary",
  MOM: "mom",
};

const MOCK_MEETINGS = [
  {
    id: 1,
    title: "Q2 Sprint Planning",
    date: "2026-05-28",
    participants: "Aryan, Priya, Rahul, Sneha",
    status: "completed",
    summary: "Discussed feature priorities for Q2 sprint. Decided to focus on auth module first.",
    mom: `**Meeting Title:** Q2 Sprint Planning\n**Date:** May 28, 2026\n**Attendees:** Aryan, Priya, Rahul, Sneha\n\n**Agenda:**\n1. Feature prioritization\n2. Timeline review\n3. Resource allocation\n\n**Discussion Points:**\n- Auth module identified as critical path item\n- Design handoff scheduled for June 3rd\n- API documentation needs update before dev begins\n\n**Decisions Made:**\n- Auth module moves to top of backlog\n- Weekly syncs every Monday 10am\n\n**Action Items:**\n- Aryan: finalize API spec by June 2\n- Priya: update UI designs by June 3\n- Rahul: set up staging environment\n\n**Next Steps:**\nFollow-up meeting on June 5 to review progress.`,
  },
  {
    id: 2,
    title: "Product Roadmap Review",
    date: "2026-05-20",
    participants: "Meera, Dev, Aisha",
    status: "completed",
    summary: "Reviewed H2 roadmap milestones and adjusted timelines based on engineering capacity.",
    mom: `**Meeting Title:** Product Roadmap Review\n**Date:** May 20, 2026\n**Attendees:** Meera, Dev, Aisha\n\n**Discussion Points:**\n- H2 milestone review\n- Timeline adjustments\n\n**Decisions Made:**\n- MVP launch pushed to August\n\n**Action Items:**\n- Dev: update Jira board\n- Meera: inform stakeholders`,
  },
  {
    id: 3,
    title: "Design System Kickoff",
    date: "2026-05-15",
    participants: "Tara, Kiran, Yash",
    status: "completed",
    summary: "Established design tokens and component library structure for the new system.",
    mom: `**Meeting Title:** Design System Kickoff\n**Date:** May 15, 2026\n**Attendees:** Tara, Kiran, Yash\n\n**Discussion Points:**\n- Design token structure\n- Component library tooling\n\n**Decisions Made:**\n- Use Figma + Storybook combo\n\n**Action Items:**\n- Tara: create initial token set\n- Kiran: set up Storybook`,
  },
];

const STATUS_COLORS = {
  completed: { bg: "#e6f4ea", text: "#1a7a3a", dot: "#2ecc71" },
  processing: { bg: "#fff8e1", text: "#7a5c00", dot: "#f0a500" },
  failed: { bg: "#fdecea", text: "#7a1a1a", dot: "#e74c3c" },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function Avatar({ name, size = 36 }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `hsl(${hue}, 55%, 88%)`,
      color: `hsl(${hue}, 55%, 30%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 600, fontSize: size * 0.38, flexShrink: 0, fontFamily: "'DM Mono', monospace",
    }}>{initials}</div>
  );
}

function Badge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.processing;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 20,
      background: c.bg, color: c.text,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.03em",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function ProgressBar({ pct, color = "#4f46e5" }) {
  return (
    <div style={{ background: "#eee", borderRadius: 4, height: 4, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.4s ease" }} />
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "48px 0" }}>
      <div style={{
        width: 40, height: 40, border: "3px solid #e2e8f0",
        borderTop: "3px solid #4f46e5", borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ─── LOGIN PAGE ─────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("login");

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0f2fe 100%)",
      fontFamily: "'Sora', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-family: inherit; }
        button { font-family: inherit; cursor: pointer; }
      `}</style>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "44px 40px",
        width: "100%", maxWidth: 420,
        boxShadow: "0 20px 60px rgba(79,70,229,0.12)",
        border: "1px solid rgba(79,70,229,0.1)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: "#4f46e5",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 22,
          }}>
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#1e1b4b" }}>MoM Generator</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>AI-powered meeting minutes</p>
        </div>

        {/* Tab */}
        <div style={{
          display: "flex", background: "#f1f5f9", borderRadius: 10,
          padding: 4, marginBottom: 28,
        }}>
          {["login", "signup"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "8px 0", border: "none", borderRadius: 8,
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#4f46e5" : "#64748b",
              fontWeight: tab === t ? 600 : 400, fontSize: 14,
              boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s",
            }}>{t === "login" ? "Sign In" : "Sign Up"}</button>
          ))}
        </div>

        {tab === "signup" && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: "#374151", fontWeight: 500, display: "block", marginBottom: 6 }}>Full name</label>
            <input type="text" placeholder="Aryan Sharma" style={{
              width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
              borderRadius: 10, fontSize: 14, color: "#1e293b", outline: "none",
            }} />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: "#374151", fontWeight: 500, display: "block", marginBottom: 6 }}>Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" style={{
              width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
              borderRadius: 10, fontSize: 14, color: "#1e293b", outline: "none",
            }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: "#374151", fontWeight: 500, display: "block", marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" style={{
              width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
              borderRadius: 10, fontSize: 14, color: "#1e293b", outline: "none",
            }} />
        </div>

        <button onClick={() => onLogin(email || "user@example.com")} style={{
          width: "100%", padding: "12px 0", background: "#4f46e5",
          color: "#fff", border: "none", borderRadius: 10,
          fontWeight: 600, fontSize: 15, letterSpacing: "0.01em",
          transition: "background 0.2s",
        }}
          onMouseOver={e => e.target.style.background = "#4338ca"}
          onMouseOut={e => e.target.style.background = "#4f46e5"}
        >{tab === "login" ? "Sign In" : "Create Account"}</button>

        {tab === "login" && (
          <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#94a3b8" }}>
            <a href="#" style={{ color: "#4f46e5", textDecoration: "none" }}>Forgot password?</a>
          </p>
        )}
      </div>
    </div>
  );
}

// ─── SIDEBAR ────────────────────────────────────────────────────────────────
function Sidebar({ view, onNav, userEmail, onLogout }) {
  const navItems = [
    { key: VIEWS.DASHBOARD, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Dashboard" },
    { key: VIEWS.CREATE, icon: "M12 4v16m8-8H4", label: "New Meeting" },
  ];

  return (
    <aside style={{
      width: 220, background: "#1e1b4b", display: "flex", flexDirection: "column",
      padding: "24px 0", flexShrink: 0,
    }}>
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>MoM AI</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {navItems.map(item => (
          <button key={item.key} onClick={() => onNav(item.key)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", border: "none", borderRadius: 10, cursor: "pointer",
            background: view === item.key ? "rgba(79,70,229,0.35)" : "transparent",
            color: view === item.key ? "#c7d2fe" : "#94a3b8",
            fontWeight: view === item.key ? 600 : 400,
            fontSize: 14, marginBottom: 2, transition: "all 0.15s", textAlign: "left",
          }}>
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "16px 16px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Avatar name={userEmail} size={32} />
          <div>
            <p style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 500, lineHeight: 1.2 }}>{userEmail.split("@")[0]}</p>
            <p style={{ fontSize: 11, color: "#64748b" }}>{userEmail}</p>
          </div>
        </div>
        <button onClick={onLogout} style={{
          width: "100%", padding: "7px 0", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, background: "transparent", color: "#64748b",
          fontSize: 12, cursor: "pointer",
        }}>Sign out</button>
      </div>
    </aside>
  );
}

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
function Dashboard({ meetings, onNew, onOpen }) {
  const [search, setSearch] = useState("");
  const filtered = meetings.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.participants.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "36px 40px", flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: "#1e1b4b", marginBottom: 4 }}>Your Meetings</h2>
          <p style={{ fontSize: 14, color: "#64748b" }}>{meetings.length} meeting records saved</p>
        </div>
        <button onClick={onNew} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", background: "#4f46e5", color: "#fff",
          border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Meeting
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Meetings", value: meetings.length, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "#4f46e5" },
          { label: "This Month", value: meetings.filter(m => m.date.startsWith("2026-05")).length, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "#0891b2" },
          { label: "Completed", value: meetings.filter(m => m.status === "completed").length, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "#059669" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "#fff", borderRadius: 14, padding: "20px 22px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{stat.label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: stat.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={stat.color} strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#1e1b4b", fontFamily: "'DM Mono', monospace" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
          <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search meetings or participants…" style={{
            width: "100%", padding: "10px 14px 10px 40px",
            border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14,
            color: "#1e293b", outline: "none", background: "#fff",
            fontFamily: "inherit",
          }} />
      </div>

      {/* Meeting Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(m => (
          <div key={m.id} onClick={() => onOpen(m)} style={{
            background: "#fff", borderRadius: 14, padding: "20px 22px",
            border: "1px solid #f1f5f9", cursor: "pointer",
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.1)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.04)"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e1b4b", marginBottom: 4 }}>{m.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{m.summary}</p>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {formatDate(m.date)}
                  </span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    {m.participants.split(",").length} participants
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <Badge status={m.status} />
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#cbd5e1" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p style={{ fontSize: 15 }}>No meetings found</p>
        </div>
      )}
    </div>
  );
}

// ─── CREATE MEETING ──────────────────────────────────────────────────────────
function CreateMeeting({ onNext, onBack }) {
  const [form, setForm] = useState({ title: "", date: new Date().toISOString().split("T")[0], agenda: "", participants: "" });

  const field = (label, key, type = "text", placeholder = "") => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, color: "#374151", fontWeight: 500, display: "block", marginBottom: 6 }}>{label}</label>
      {type === "textarea" ? (
        <textarea value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder} rows={3} style={{
            width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
            borderRadius: 10, fontSize: 14, color: "#1e293b", outline: "none",
            resize: "vertical", fontFamily: "inherit", lineHeight: 1.5,
          }} />
      ) : (
        <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder} style={{
            width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
            borderRadius: 10, fontSize: 14, color: "#1e293b", outline: "none", fontFamily: "inherit",
          }} />
      )}
    </div>
  );

  return (
    <div style={{ padding: "36px 40px", flex: 1, overflowY: "auto" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", marginBottom: 28 }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to dashboard
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1e1b4b", marginBottom: 6 }}>Create New Meeting</h2>
      <p style={{ fontSize: 14, color: "#64748b", marginBottom: 32 }}>Set up your meeting details before recording or uploading audio.</p>

      <div style={{ maxWidth: 560 }}>
        {field("Meeting Title", "title", "text", "e.g. Q2 Sprint Planning")}
        {field("Date", "date", "date")}
        {field("Participants", "participants", "text", "e.g. Aryan, Priya, Rahul")}
        {field("Agenda / Description", "agenda", "textarea", "What topics will be covered?")}

        <button onClick={() => onNext(form)} disabled={!form.title} style={{
          padding: "12px 28px", background: form.title ? "#4f46e5" : "#e2e8f0",
          color: form.title ? "#fff" : "#94a3b8", border: "none",
          borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: form.title ? "pointer" : "default",
          transition: "all 0.2s",
        }}>
          Continue to Audio →
        </button>
      </div>
    </div>
  );
}

// ─── RECORD / UPLOAD ─────────────────────────────────────────────────────────
function RecordAudio({ meetingForm, onNext, onBack }) {
  const [mode, setMode] = useState(null); // "record" | "upload"
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [uploaded, setUploaded] = useState(null);
  const [dragging, setDragging] = useState(false);
  const timerRef = useRef(null);
  const fileRef = useRef(null);

  const startRecord = () => {
    setRecording(true); setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(t => t + 1), 1000);
  };
  const stopRecord = () => {
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleFile = (file) => {
    if (file) setUploaded(file.name);
  };

  const canProceed = (mode === "record" && elapsed > 0 && !recording) || (mode === "upload" && uploaded);

  return (
    <div style={{ padding: "36px 40px", flex: 1, overflowY: "auto" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", marginBottom: 28 }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1e1b4b", marginBottom: 6 }}>Audio Input</h2>
      <p style={{ fontSize: 14, color: "#64748b", marginBottom: 32 }}>
        <strong style={{ color: "#4f46e5" }}>{meetingForm.title}</strong> · {formatDate(meetingForm.date)}
      </p>

      {/* Mode selector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 560, marginBottom: 32 }}>
        {[
          { key: "record", label: "Record Live", desc: "Use your microphone", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
          { key: "upload", label: "Upload File", desc: "MP3, WAV, M4A, OGG", icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" },
        ].map(opt => (
          <button key={opt.key} onClick={() => setMode(opt.key)} style={{
            padding: "24px 20px", border: `2px solid ${mode === opt.key ? "#4f46e5" : "#e2e8f0"}`,
            borderRadius: 14, background: mode === opt.key ? "#ede9fe" : "#fff",
            cursor: "pointer", textAlign: "left", transition: "all 0.15s",
          }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"
              stroke={mode === opt.key ? "#4f46e5" : "#94a3b8"} strokeWidth="1.8"
              style={{ marginBottom: 10, display: "block" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d={opt.icon} />
            </svg>
            <p style={{ fontSize: 15, fontWeight: 600, color: mode === opt.key ? "#4f46e5" : "#1e1b4b", marginBottom: 2 }}>{opt.label}</p>
            <p style={{ fontSize: 12, color: "#64748b" }}>{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* Record panel */}
      {mode === "record" && (
        <div style={{ maxWidth: 560, background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #f1f5f9" }}>
          <div style={{ textAlign: "center" }}>
            {recording && (
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{
                    width: 4, borderRadius: 2, background: "#ef4444",
                    animation: `wave${i} 0.6s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.1}s`,
                  }} />
                ))}
              </div>
            )}
            <style>{`
              @keyframes wave1{from{height:8px}to{height:28px}}
              @keyframes wave2{from{height:14px}to{height:36px}}
              @keyframes wave3{from{height:10px}to{height:32px}}
              @keyframes wave4{from{height:16px}to{height:24px}}
              @keyframes wave5{from{height:6px}to{height:20px}}
            `}</style>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 42, fontWeight: 500, color: recording ? "#ef4444" : "#1e1b4b", marginBottom: 16 }}>
              {fmt(elapsed)}
            </p>
            <button onClick={recording ? stopRecord : startRecord} style={{
              width: 64, height: 64, borderRadius: "50%",
              background: recording ? "#ef4444" : "#4f46e5",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto", transition: "transform 0.1s",
            }}>
              {recording ? (
                <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              )}
            </button>
            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 12 }}>{recording ? "Click to stop recording" : "Click to start recording"}</p>
          </div>
        </div>
      )}

      {/* Upload panel */}
      {mode === "upload" && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          style={{
            maxWidth: 560, border: `2px dashed ${dragging ? "#4f46e5" : uploaded ? "#10b981" : "#c7d2fe"}`,
            borderRadius: 16, padding: "40px 20px", textAlign: "center",
            background: dragging ? "#ede9fe" : uploaded ? "#ecfdf5" : "#f8f7ff",
            cursor: "pointer", transition: "all 0.2s",
          }}>
          <input ref={fileRef} type="file" accept="audio/*" onChange={e => handleFile(e.target.files[0])} style={{ display: "none" }} />
          {uploaded ? (
            <>
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="1.8" style={{ margin: "0 auto 12px", display: "block" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#065f46" }}>{uploaded}</p>
              <p style={{ fontSize: 13, color: "#34d399", marginTop: 4 }}>File ready to process</p>
            </>
          ) : (
            <>
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#818cf8" strokeWidth="1.8" style={{ margin: "0 auto 12px", display: "block" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#4f46e5" }}>Drop audio file here</p>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>or click to browse · MP3, WAV, M4A, OGG</p>
            </>
          )}
        </div>
      )}

      {canProceed && (
        <button onClick={() => onNext({ ...meetingForm, audioLength: elapsed || 180 })} style={{
          marginTop: 24, padding: "12px 28px", background: "#4f46e5", color: "#fff",
          border: "none", borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: "pointer",
        }}>
          Process Audio →
        </button>
      )}
    </div>
  );
}

// ─── PROCESSING / TRANSCRIPT ──────────────────────────────────────────────────
const MOCK_TRANSCRIPT = `[00:00] Aryan: Alright everyone, let's get started. Today we're doing the Q2 sprint planning. I'll be taking notes. We have Priya, Rahul, and Sneha joining.

[00:18] Priya: Thanks Aryan. So the main thing I wanted to discuss is the auth module. From a design perspective, we've got the wireframes ready but we need a final call on the flow for password reset.

[00:35] Rahul: From the backend side, the auth module is going to touch a lot of the existing tables. I'd suggest we start with just email-password login and add OAuth in the next sprint.

[00:52] Sneha: That makes sense. The staging environment isn't fully set up yet either, so if we rush OAuth integration it could create blockers for QA.

[01:08] Aryan: Agreed. So decision one — auth module first, OAuth in sprint 3. Rahul, can you have the API spec ready by June 2nd?

[01:20] Rahul: Yes, that's doable. I'll also document the endpoints in Swagger.

[01:28] Priya: I can have the updated UI designs for the login and reset flow by June 3rd. I'll share them in Figma.

[01:40] Aryan: Perfect. Sneha, staging environment by when?

[01:45] Sneha: I can have the base environment up by June 4th. Might need some help from Rahul on the DB config.

[01:52] Rahul: Sure, just ping me on Slack.

[02:00] Aryan: Great. One more thing — weekly syncs. I'm thinking every Monday at 10am. Does that work for everyone?

[02:08] Priya, Rahul, Sneha: Works for us.

[02:12] Aryan: Alright, let's wrap up. We'll do a follow-up on June 5th to check on progress.`;

function TranscriptView({ meetingForm, onNext, onBack }) {
  const [step, setStep] = useState("processing"); // "processing" | "review"
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState(MOCK_TRANSCRIPT);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    if (step !== "processing") return;
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(iv); setStep("review"); return 100; }
        return p + Math.random() * 8 + 2;
      });
    }, 200);
    return () => clearInterval(iv);
  }, [step]);

  if (step === "processing") {
    return (
      <div style={{ padding: "36px 40px", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#4f46e5" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e1b4b", marginBottom: 6 }}>Transcribing Audio…</h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 28 }}>Converting speech to text using AI. This may take a moment.</p>
          <div style={{ marginBottom: 8 }}>
            <ProgressBar pct={Math.min(progress, 100)} />
          </div>
          <p style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", color: "#4f46e5" }}>{Math.round(Math.min(progress, 100))}%</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 40px", flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", marginBottom: 28 }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1e1b4b", marginBottom: 4 }}>Review Transcript</h2>
          <p style={{ fontSize: 14, color: "#64748b" }}>Check the transcript and correct any errors before generating MoM.</p>
        </div>
        {edited && <Badge status="processing" />}
      </div>

      <div style={{
        flex: 1, background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9",
        padding: 20, marginBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Transcript</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{transcript.split(/\s+/).length} words</span>
        </div>
        <textarea value={transcript} onChange={e => { setTranscript(e.target.value); setEdited(true); }}
          style={{
            width: "100%", minHeight: 340, border: "none", outline: "none",
            fontSize: 13, lineHeight: 1.8, color: "#374151",
            fontFamily: "'DM Mono', monospace", resize: "vertical",
          }} />
      </div>

      <button onClick={() => onNext({ ...meetingForm, transcript })} style={{
        alignSelf: "flex-start", padding: "12px 28px", background: "#4f46e5", color: "#fff",
        border: "none", borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: "pointer",
      }}>
        Generate MoM →
      </button>
    </div>
  );
}

// ─── MOM VIEWER ───────────────────────────────────────────────────────────────
const MOCK_MOM = (form) => `**Meeting Title:** ${form.title || "Team Meeting"}
**Date:** ${formatDate(form.date || new Date().toISOString().split("T")[0])}
**Attendees:** ${form.participants || "Team Members"}
**Facilitator:** Meeting Host

---

**Agenda:**
${form.agenda || "1. Project updates\n2. Planning\n3. Action items"}

---

**Discussion Points:**

1. **Auth Module Priority** — The team agreed to prioritize email-password authentication in the current sprint. OAuth will be deferred to Sprint 3 to reduce scope and avoid staging environment blockers.

2. **Staging Environment** — The staging environment is not fully ready. Setup is targeted for June 4th, with potential support needed on the database configuration side.

3. **Design Handoff** — UI wireframes for login and password reset flows are ready. Final designs will be shared via Figma by June 3rd.

4. **Weekly Sync Cadence** — The team aligned on a recurring Monday sync at 10:00 AM to maintain project momentum.

---

**Decisions Made:**

- Auth module (email-password only) moves to top priority
- OAuth integration pushed to Sprint 3
- Weekly Monday standups at 10:00 AM

---

**Action Items:**

| Owner | Task | Deadline |
|-------|------|----------|
| Rahul | Finalize API spec + Swagger docs | June 2 |
| Priya | Updated login/reset UI designs in Figma | June 3 |
| Sneha | Staging environment setup | June 4 |

---

**Next Steps:**
Follow-up meeting scheduled for June 5th to review progress on all action items.`;

function MoMViewer({ meetingData, onSave, onBack }) {
  const [step, setStep] = useState("generating"); // "generating" | "view"
  const [progress, setProgress] = useState(0);
  const [momText, setMomText] = useState("");
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (step !== "generating") return;
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(iv);
          setMomText(MOCK_MOM(meetingData));
          setStep("view");
          return 100;
        }
        return p + Math.random() * 10 + 3;
      });
    }, 180);
    return () => clearInterval(iv);
  }, [step]);

  const copy = () => {
    navigator.clipboard?.writeText(momText.replace(/\*\*/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === "generating") {
    return (
      <div style={{ padding: "36px 40px", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1e1b4b", marginBottom: 6 }}>Generating Minutes…</h3>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 28 }}>AI is analyzing the transcript and composing your meeting minutes.</p>
          <ProgressBar pct={Math.min(progress, 100)} color="#059669" />
          <p style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", color: "#059669", marginTop: 8 }}>{Math.round(Math.min(progress, 100))}%</p>
        </div>
      </div>
    );
  }

  const renderMoM = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} style={{ fontWeight: 700, color: "#1e1b4b", margin: "4px 0" }}>{line.replace(/\*\*/g, "")}</p>;
      }
      if (line.startsWith("---")) {
        return <hr key={i} style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "16px 0" }} />;
      }
      if (line.startsWith("| ")) {
        return null; // handled in table block
      }
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} style={{ margin: "3px 0", fontSize: 14, color: line.startsWith("#") ? "#1e1b4b" : "#374151", lineHeight: 1.7 }}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        </p>
      );
    });
  };

  // Parse action items table
  const tableMatch = momText.match(/\| Owner.*\|[\s\S]*?(?=\n---|\n\*\*Next)/);
  const tableLines = tableMatch ? tableMatch[0].split("\n").filter(l => l.startsWith("|")) : [];

  return (
    <div style={{ padding: "36px 40px", flex: 1, overflowY: "auto" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", marginBottom: 28 }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1e1b4b" }}>Minutes of Meeting</h2>
            <Badge status="completed" />
          </div>
          <p style={{ fontSize: 14, color: "#64748b" }}>Generated by AI · Ready to save or export</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setEditing(!editing)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", border: "1.5px solid #e2e8f0",
            borderRadius: 9, background: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "#374151",
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            {editing ? "Preview" : "Edit"}
          </button>
          <button onClick={copy} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", border: "1.5px solid #e2e8f0",
            borderRadius: 9, background: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "#374151",
          }}>
            {copied ? (
              <><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied!</>
            ) : (
              <><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
            )}
          </button>
          <button onClick={() => onSave({ ...meetingData, mom: momText, status: "completed", summary: "AI-generated meeting summary" })} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", background: "#4f46e5", color: "#fff",
            border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            Save to Archive
          </button>
        </div>
      </div>

      {editing ? (
        <textarea value={momText} onChange={e => setMomText(e.target.value)} style={{
          width: "100%", minHeight: 500, padding: 20, border: "1.5px solid #e2e8f0",
          borderRadius: 14, fontSize: 13, lineHeight: 1.8, color: "#374151",
          fontFamily: "'DM Mono', monospace", outline: "none", resize: "vertical",
        }} />
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", padding: "32px 36px" }}>
          {/* Action items table separately */}
          <div style={{ marginBottom: 8 }}>
            {momText.split("\n").map((line, i) => {
              if (line.startsWith("| ")) {
                const cells = line.split("|").filter(c => c.trim()).map(c => c.trim());
                if (cells[0] === "---" || cells[0].startsWith("---")) return null;
                const isHeader = cells[0] === "Owner";
                return (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "120px 1fr 100px",
                    gap: 12, padding: "8px 12px",
                    background: isHeader ? "#f8f7ff" : "transparent",
                    borderRadius: isHeader ? 8 : 0,
                    borderBottom: "1px solid #f1f5f9",
                  }}>
                    {cells.map((c, j) => (
                      <span key={j} style={{ fontSize: 13, color: isHeader ? "#64748b" : "#374151", fontWeight: isHeader ? 600 : 400 }}>{c}</span>
                    ))}
                  </div>
                );
              }
              if (line === "---") return <hr key={i} style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "16px 0" }} />;
              const bold = line.match(/^\*\*(.*)\*\*:(.*)$/);
              if (bold) return (
                <p key={i} style={{ margin: "6px 0", fontSize: 14, lineHeight: 1.7, color: "#374151" }}>
                  <strong style={{ color: "#1e1b4b" }}>{bold[1]}:</strong>{bold[2]}
                </p>
              );
              const inline = line.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={i} style={{ margin: "3px 0", fontSize: 14, lineHeight: 1.7, color: "#374151" }}>
                  {inline.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: "#1e1b4b" }}>{p}</strong> : p)}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MEETING DETAIL (from dashboard) ─────────────────────────────────────────
function MeetingDetail({ meeting, onBack }) {
  const [tab, setTab] = useState("mom");
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(meeting.mom?.replace(/\*\*/g, "") || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: "36px 40px", flex: 1, overflowY: "auto" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", marginBottom: 28 }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to dashboard
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1e1b4b", marginBottom: 4 }}>{meeting.title}</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>{formatDate(meeting.date)}</span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>·</span>
            <span style={{ fontSize: 13, color: "#64748b" }}>{meeting.participants}</span>
            <Badge status={meeting.status} />
          </div>
        </div>
        <button onClick={copy} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", border: "1.5px solid #e2e8f0",
          borderRadius: 9, background: "#fff", fontSize: 13, cursor: "pointer", color: "#374151",
        }}>
          {copied ? "Copied!" : "Copy MoM"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: "1px solid #f1f5f9" }}>
        {["mom", "summary"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", border: "none", background: "transparent",
            color: tab === t ? "#4f46e5" : "#64748b",
            fontWeight: tab === t ? 600 : 400, fontSize: 14, cursor: "pointer",
            borderBottom: tab === t ? "2px solid #4f46e5" : "2px solid transparent",
            transition: "all 0.15s", marginBottom: -1,
          }}>{t === "mom" ? "Minutes of Meeting" : "AI Summary"}</button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", padding: "28px 32px" }}>
        {tab === "summary" ? (
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "#374151" }}>{meeting.summary}</p>
        ) : (
          meeting.mom?.split("\n").map((line, i) => {
            if (line === "---") return <hr key={i} style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "16px 0" }} />;
            if (line.startsWith("| ")) {
              const cells = line.split("|").filter(c => c.trim()).map(c => c.trim());
              if (cells[0].startsWith("---")) return null;
              const isHeader = cells[0] === "Owner";
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "120px 1fr 100px",
                  gap: 12, padding: "8px 12px",
                  background: isHeader ? "#f8f7ff" : "transparent",
                  borderRadius: isHeader ? 8 : 0, borderBottom: "1px solid #f1f5f9",
                }}>
                  {cells.map((c, j) => (
                    <span key={j} style={{ fontSize: 13, color: isHeader ? "#64748b" : "#374151", fontWeight: isHeader ? 600 : 400 }}>{c}</span>
                  ))}
                </div>
              );
            }
            const inline = line.split(/\*\*(.*?)\*\*/g);
            return (
              <p key={i} style={{ margin: "3px 0", fontSize: 14, lineHeight: 1.7, color: "#374151" }}>
                {inline.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: "#1e1b4b" }}>{p}</strong> : p)}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [meetings, setMeetings] = useState(MOCK_MEETINGS);
  const [meetingForm, setMeetingForm] = useState(null);
  const [meetingData, setMeetingData] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  if (!authed) {
    return <LoginPage onLogin={(email) => { setUserEmail(email); setAuthed(true); }} />;
  }

  const addMeeting = (data) => {
    const newMeeting = {
      id: meetings.length + 1,
      title: data.title,
      date: data.date,
      participants: data.participants || "You",
      status: "completed",
      summary: data.summary || "AI-generated meeting minutes.",
      mom: data.mom,
    };
    setMeetings([newMeeting, ...meetings]);
    setView(VIEWS.DASHBOARD);
  };

  const renderMain = () => {
    if (selectedMeeting) {
      return <MeetingDetail meeting={selectedMeeting} onBack={() => setSelectedMeeting(null)} />;
    }
    switch (view) {
      case VIEWS.DASHBOARD:
        return <Dashboard meetings={meetings} onNew={() => setView(VIEWS.CREATE)}
          onOpen={(m) => setSelectedMeeting(m)} />;
      case VIEWS.CREATE:
        return <CreateMeeting onNext={(form) => { setMeetingForm(form); setView(VIEWS.RECORD); }} onBack={() => setView(VIEWS.DASHBOARD)} />;
      case VIEWS.RECORD:
        return <RecordAudio meetingForm={meetingForm} onNext={(data) => { setMeetingData(data); setView(VIEWS.TRANSCRIPT); }} onBack={() => setView(VIEWS.CREATE)} />;
      case VIEWS.TRANSCRIPT:
        return <TranscriptView meetingForm={meetingData} onNext={(data) => { setMeetingData(data); setView(VIEWS.MOM); }} onBack={() => setView(VIEWS.RECORD)} />;
      case VIEWS.MOM:
        return <MoMViewer meetingData={meetingData} onSave={addMeeting} onBack={() => setView(VIEWS.TRANSCRIPT)} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Sora', sans-serif", background: "#f8f7ff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, textarea, button { font-family: inherit; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
      `}</style>
      <Sidebar view={view} onNav={(v) => { setSelectedMeeting(null); setView(v); }} userEmail={userEmail} onLogout={() => setAuthed(false)} />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {renderMain()}
      </main>
    </div>
  );
}
