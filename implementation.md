# MoM Generator — Implementation Plan

> A web app that records or uploads meeting audio, converts it into text, and generates a structured summary and Minutes of Meeting using AI.

---

## 1. Current Project State

### What exists today

| Item | Status | Notes |
|------|--------|-------|
| Next.js 16.2.6 | ✅ Installed | App Router, RSC enabled |
| React 19.2.4 | ✅ Installed | Latest React |
| shadcn/ui (radix-nova) | ✅ Initialized | Only `Button` component installed |
| Tailwind CSS v4 | ✅ Configured | Using `@theme inline` blocks |
| Biome 2.2.0 | ✅ Configured | Linting + formatting |
| Bun | ✅ Package manager | Lockfile: `bun.lock` |
| Fonts | ✅ Loaded | Inter (sans) + Instrument Serif (serif) |
| Dark mode | ✅ Default | `className="dark"` on `<html>` |
| Supabase | ❌ Not installed | Required for auth, DB, storage |
| Routing | ❌ Only `/` exists | Placeholder page |
| Components | ❌ Minimal | Only `Button` in `src/components/ui/` |

### Project structure

```
MoM/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (Inter + Instrument Serif fonts, dark mode)
│   │   ├── page.tsx            # Placeholder home page
│   │   └── favicon.ico
│   ├── components/
│   │   └── ui/
│   │       └── button.tsx      # Only installed shadcn component
│   ├── lib/
│   │   └── utils.ts            # cn() utility
│   └── styles/
│       ├── globals.css         # Active global styles (DO NOT MODIFY per AGENTS.md)
│       ├── globals_claude.css  # Alternate theme (shadcn config points here)
│       └── globals_fc.css      # Alternate theme
├── public/
│   ├── FCLogo.svg
│   └── FCLogoSquareCentered.svg
├── docs/
│   ├── project_planning_document.md
│   ├── MoM_Planning_Document.md
│   ├── extracted_planning_doc.txt
│   └── guides/
│       └── shadcn.md
├── components.json             # shadcn config (style: radix-nova, base: radix, icons: lucide)
├── package.json
├── tsconfig.json
├── next.config.ts
├── biome.json
├── postcss.config.mjs
└── AGENTS.md
```

---

## 2. Rules & Constraints (from AGENTS.md)

> [!IMPORTANT]
> These rules are **non-negotiable** and must be followed in every implementation step.

| # | Rule | Impact |
|---|------|--------|
| 1 | **Strictly use shadcn for UI** — Use the shadcn skill, install MCP Server | Every UI component must come from shadcn registry. Run `bunx --bun shadcn@latest add <component>` before using. |
| 2 | **Ample white-spacing** | Generous padding, margins, and `gap-*` in all layouts. No cramped interfaces. |
| 3 | **Minimal and SaaS-looking UI** | Clean, professional design. No decoration overload. Neutral palette with accent colors. |
| 4 | **DO NOT CHANGE `/src/styles` files** | Only modify individual shadcn component files. Global CSS is frozen. |
| 5 | **Next.js may have breaking changes** | Read `node_modules/next/dist/docs/` guides before writing code. Verify APIs against current version. |
| 6 | **Bun is the package manager** | All installs via `bun add`. No npm/yarn/pnpm. |

### shadcn Skill Rules (from `.agents/skills/shadcn/SKILL.md`)

- Use `bunx --bun shadcn@latest` for all shadcn CLI commands
- Use semantic colors (`bg-primary`, `text-muted-foreground`) — never raw colors
- Use `gap-*` instead of `space-x-*` / `space-y-*`
- Use `size-*` when width = height
- Use `cn()` for conditional classes
- Forms must use `FieldGroup` + `Field` — not raw divs
- Icons in buttons use `data-icon` attribute
- Always check installed components before adding
- Always run `bunx --bun shadcn@latest docs <component>` and fetch URLs before using a component
- `"use client"` required for components using `useState`, `useEffect`, event handlers, or browser APIs (RSC is enabled)

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│             Next.js 16 App Router                │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │  Auth    │ │Dashboard │ │  Meeting Detail   │ │
│  │  Pages   │ │  Page    │ │  (Record/Upload   │ │
│  │          │ │          │ │   Transcript/MoM) │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│                                                  │
│  shadcn/ui Components + Tailwind CSS v4          │
└──────────────────┬──────────────────────────────┘
                   │
                   │ Next.js API Routes / Server Actions
                   │
┌──────────────────▼──────────────────────────────┐
│                  SUPABASE                        │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │   Auth   │ │ Postgres │ │    Storage        │ │
│  │  (Email  │ │   (6     │ │  (Audio files)    │ │
│  │  +OAuth) │ │  tables) │ │                   │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
└──────────────────┬──────────────────────────────┘
                   │
                   │ API Calls from Server Actions
                   │
┌──────────────────▼──────────────────────────────┐
│            AI PROCESSING LAYER                   │
│                                                  │
│  ┌─────────────────┐  ┌──────────────────────┐  │
│  │  Speech-to-Text │  │  AI Summarization    │  │
│  │  (Web Speech    │  │  + MoM Generation    │  │
│  │   API / Whisper)│  │  (Groq free-tier)    │  │
│  └─────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 4. Tech Stack Decisions

### Confirmed Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Framework | **Next.js 16** (App Router) | Already installed, SSR + API routes |
| UI Library | **shadcn/ui** (radix-nova) | AGENTS.md rule #1, already initialized |
| Styling | **Tailwind CSS v4** | Already configured, `@theme inline` |
| Backend/Auth/DB | **Supabase** | Per planning doc, free-tier, auth + DB + storage |
| Package Manager | **Bun** | Per README and lockfile |
| Linter/Formatter | **Biome** | Already configured |

### Decisions Required

> [!IMPORTANT]
> The following choices impact cost, complexity, and performance. Recommendations are provided.

#### Speech-to-Text (STT)

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **Web Speech API** (browser-native) | Zero cost, no backend needed, instant | Chrome-only, no file upload support, no offline | Free |
| **Whisper via Groq API** | Fast, accurate, supports file uploads, free tier | 20 req/min limit on free tier, needs API key | Free tier |
| **OpenAI Whisper (self-hosted)** | Full control, offline capable | Requires GPU server, complex setup | Infrastructure cost |

**Recommendation:** Use **Groq's Whisper API** (free tier) for uploaded audio files, and optionally the **Web Speech API** for live browser recording as a progressive enhancement. This keeps costs at zero while supporting both use cases.

#### AI Summarization / MoM Generation

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **Groq (Llama 3 / Mixtral)** | Very fast inference, generous free tier, easy API | Rate limits on free tier | Free tier |
| **Google Gemini API** | Generous free tier, good quality | Slightly slower | Free tier |
| **Ollama (self-hosted)** | Fully offline, no API limits | Requires local GPU, complex deploy | Infrastructure |

**Recommendation:** Use **Groq free-tier** with `llama-3.3-70b-versatile` for summarization and MoM generation. Single provider for both STT (Whisper) and LLM keeps integration simple.

---

## 5. Supabase Schema

Based on the planning document's schema diagram:

```sql
-- Users table (extends Supabase auth.users)
-- Supabase Auth handles user_id, email automatically
-- We create a profiles table for additional user data
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetings table
CREATE TABLE meetings (
  meeting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  status TEXT DEFAULT 'created'
    CHECK (status IN ('created', 'uploaded', 'transcribing', 'summarizing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audio files table
CREATE TABLE audio_files (
  file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(meeting_id) ON DELETE CASCADE,
  storage_url TEXT NOT NULL,
  file_name TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transcripts table
CREATE TABLE transcripts (
  transcript_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(meeting_id) ON DELETE CASCADE,
  transcript_text TEXT NOT NULL,
  edited_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Summaries table
CREATE TABLE summaries (
  summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(meeting_id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MoMs table
CREATE TABLE moms (
  mom_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(meeting_id) ON DELETE CASCADE,
  mom_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

All tables will have RLS enabled so users can only access their own data:

```sql
-- Example for meetings table (same pattern for all tables)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meetings"
  ON meetings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meetings"
  ON meetings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meetings"
  ON meetings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meetings"
  ON meetings FOR DELETE USING (auth.uid() = user_id);
```

### Supabase Storage

- **Bucket:** `meeting-audio` (private, max 50MB per file)
- **Accepted formats:** `.mp3`, `.wav`, `.m4a`, `.webm`, `.ogg`

---

## 6. File & Folder Structure (Target)

```
src/
├── app/
│   ├── layout.tsx                      # Root layout (existing — keep as-is)
│   ├── page.tsx                        # Landing page / redirect to dashboard
│   │
│   ├── (auth)/                         # Auth route group (no layout nesting)
│   │   ├── login/
│   │   │   └── page.tsx                # Login page
│   │   └── signup/
│   │       └── page.tsx                # Signup page
│   │
│   ├── (app)/                          # Authenticated app route group
│   │   ├── layout.tsx                  # App layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Dashboard — meeting list + new meeting
│   │   └── meeting/
│   │       └── [id]/
│   │           └── page.tsx            # Meeting detail — audio/transcript/MoM
│   │
│   └── api/                            # API routes
│       ├── transcribe/
│       │   └── route.ts                # POST: Send audio to Whisper (Groq)
│       ├── summarize/
│       │   └── route.ts                # POST: Send transcript to LLM (Groq)
│       └── auth/
│           └── callback/
│               └── route.ts            # Supabase auth callback handler
│
├── components/
│   ├── ui/                             # shadcn components (auto-managed)
│   │   ├── button.tsx                  # (existing)
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── skeleton.tsx
│   │   ├── separator.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── field.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── scroll-area.tsx
│   │   ├── progress.tsx
│   │   ├── sidebar.tsx
│   │   ├── alert.tsx
│   │   ├── empty.tsx
│   │   ├── spinner.tsx
│   │   ├── tooltip.tsx
│   │   └── avatar.tsx
│   │
│   ├── auth/                           # Auth-specific components
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   │
│   ├── dashboard/                      # Dashboard components
│   │   ├── meeting-card.tsx
│   │   ├── meeting-list.tsx
│   │   ├── new-meeting-dialog.tsx
│   │   └── status-badge.tsx
│   │
│   ├── meeting/                        # Meeting detail components
│   │   ├── audio-recorder.tsx          # Browser audio recording
│   │   ├── audio-uploader.tsx          # Drag-and-drop file upload
│   │   ├── transcript-panel.tsx        # Editable transcript view
│   │   ├── summary-panel.tsx           # AI summary display
│   │   ├── mom-preview.tsx             # Final MoM document view
│   │   └── processing-status.tsx       # Step-by-step progress indicator
│   │
│   └── layout/                         # Shared layout components
│       ├── app-sidebar.tsx
│       ├── app-header.tsx
│       └── user-menu.tsx
│
├── lib/
│   ├── utils.ts                        # (existing — cn() utility)
│   ├── supabase/
│   │   ├── client.ts                   # Supabase browser client
│   │   ├── server.ts                   # Supabase server client (for RSC/actions)
│   │   └── middleware.ts               # Auth middleware helper
│   ├── groq.ts                         # Groq API client setup
│   └── types/
│       └── database.ts                 # TypeScript types for Supabase tables
│
├── hooks/                              # Custom React hooks
│   ├── use-audio-recorder.ts           # MediaRecorder API hook
│   └── use-meeting.ts                  # Meeting CRUD operations hook
│
├── actions/                            # Server Actions
│   ├── meetings.ts                     # Create, update, delete meetings
│   ├── transcribe.ts                   # Trigger transcription pipeline
│   └── generate-mom.ts                 # Trigger AI summary + MoM generation
│
└── styles/                             # DO NOT MODIFY (per AGENTS.md rule #4)
    ├── globals.css
    ├── globals_claude.css
    └── globals_fc.css
```

---

## 7. Implementation Phases

### Phase 1: Foundation & Auth

> Set up Supabase, authentication flow, and base layout.

#### Tasks

1. **Install Supabase dependencies**
   ```bash
   bun add @supabase/supabase-js @supabase/ssr
   ```

2. **Create Supabase project** (manual step — user sets up at supabase.com)
   - Create project
   - Get `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Create `.env.local` with credentials

3. **Set up Supabase clients**
   - `src/lib/supabase/client.ts` — browser client using `createBrowserClient`
   - `src/lib/supabase/server.ts` — server client using `createServerClient`
   - `src/middleware.ts` — session refresh middleware

4. **Create database schema**
   - Run SQL migrations in Supabase dashboard (from Section 5)
   - Enable RLS on all tables
   - Create `profiles` trigger on `auth.users` insert

5. **Install required shadcn components**
   ```bash
   bunx --bun shadcn@latest add card input field separator avatar dropdown-menu sidebar badge spinner alert
   ```

6. **Build auth pages**
   - `src/app/(auth)/login/page.tsx` — Email/password login form
   - `src/app/(auth)/signup/page.tsx` — Registration form
   - `src/app/api/auth/callback/route.ts` — OAuth callback handler

7. **Build app layout**
   - `src/app/(app)/layout.tsx` — Sidebar + header layout
   - `src/components/layout/app-sidebar.tsx` — Navigation sidebar
   - `src/components/layout/app-header.tsx` — Top header with user menu
   - `src/components/layout/user-menu.tsx` — Dropdown with logout

8. **Update root page**
   - Redirect to `/dashboard` if authenticated, `/login` if not

---

### Phase 2: Dashboard & Meeting CRUD

> Build the dashboard and meeting creation flow.

#### Tasks

1. **Install additional shadcn components**
   ```bash
   bunx --bun shadcn@latest add dialog empty skeleton scroll-area tooltip progress
   ```

2. **Build dashboard page**
   - `src/app/(app)/dashboard/page.tsx` — Fetch and display meetings
   - `src/components/dashboard/meeting-list.tsx` — Grid/list of meeting cards
   - `src/components/dashboard/meeting-card.tsx` — Individual meeting card (title, date, status badge)
   - `src/components/dashboard/status-badge.tsx` — Color-coded processing status
   - `src/components/dashboard/new-meeting-dialog.tsx` — Dialog form for creating meetings

3. **Create server actions for meetings**
   - `src/actions/meetings.ts`:
     - `createMeeting(formData)` — Insert into `meetings` table
     - `deleteMeeting(meetingId)` — Delete meeting and cascade
     - `updateMeeting(meetingId, data)` — Update title/description

4. **Empty state**
   - Use shadcn `Empty` component when no meetings exist
   - Show a clear CTA to create the first meeting

---

### Phase 3: Audio Input (Recording + Upload)

> Enable audio capture and file upload with Supabase Storage.

#### Tasks

1. **Install additional shadcn components**
   ```bash
   bunx --bun shadcn@latest add tabs textarea
   ```

2. **Set up Supabase Storage**
   - Create `meeting-audio` bucket (private)
   - Add storage policies for authenticated users

3. **Build meeting detail page**
   - `src/app/(app)/meeting/[id]/page.tsx` — Tabbed layout (Audio → Transcript → Summary → MoM)

4. **Build audio recorder component**
   - `src/components/meeting/audio-recorder.tsx` — Uses MediaRecorder API
   - `src/hooks/use-audio-recorder.ts` — Custom hook encapsulating:
     - `startRecording()`, `stopRecording()`, `pauseRecording()`
     - Audio level visualization
     - Timer display
     - Output: `Blob` (webm/wav format)
   - Must have `"use client"` directive (uses browser APIs)

5. **Build audio uploader component**
   - `src/components/meeting/audio-uploader.tsx` — Drag-and-drop zone
   - File validation: format (mp3/wav/m4a/webm/ogg), size (max 50MB)
   - Upload progress indicator
   - Upload to Supabase Storage, save URL to `audio_files` table

6. **Build processing status component**
   - `src/components/meeting/processing-status.tsx` — Step indicator showing:
     - `uploaded` → `transcribing` → `summarizing` → `completed`
   - Use shadcn `Progress` + `Badge` components

---

### Phase 4: Transcription Pipeline

> Convert audio to text using Groq Whisper API.

#### Tasks

1. **Install Groq SDK**
   ```bash
   bun add groq-sdk
   ```

2. **Set up Groq client**
   - `src/lib/groq.ts` — Initialize Groq client with API key from env
   - Add `GROQ_API_KEY` to `.env.local`

3. **Build transcription API route**
   - `src/app/api/transcribe/route.ts`:
     - Accepts `meeting_id`
     - Fetches audio from Supabase Storage
     - Sends to Groq Whisper API (`whisper-large-v3-turbo`)
     - Saves transcript to `transcripts` table
     - Updates meeting status to `transcribing` → `transcribed`
     - Returns transcript text

4. **Build server action**
   - `src/actions/transcribe.ts` — Triggers transcription, handles errors and retries

5. **Build transcript panel**
   - `src/components/meeting/transcript-panel.tsx`:
     - Display transcript text in a readable format
     - Editable mode (save edited text to `edited_text` column)
     - Use shadcn `Textarea` + `ScrollArea`
     - Loading state with `Skeleton`

---

### Phase 5: AI Summary & MoM Generation

> Use Groq LLM to summarize transcripts and generate structured MoM.

#### Tasks

1. **Build summarization API route**
   - `src/app/api/summarize/route.ts`:
     - Accepts `meeting_id`
     - Fetches transcript (edited version if available) from DB
     - Sends to Groq LLM with structured prompt
     - Saves summary to `summaries` table
     - Generates MoM from summary
     - Saves MoM to `moms` table
     - Updates meeting status to `completed`

2. **Design AI prompts**
   - Summary prompt: Extract key discussion points, decisions, action items
   - MoM prompt: Format into structured MoM document with:
     - Meeting title, date, attendees
     - Agenda items
     - Discussion points
     - Decisions made
     - Action items with owners
     - Next steps

3. **Build server action**
   - `src/actions/generate-mom.ts` — Orchestrates summary + MoM generation

4. **Build summary panel**
   - `src/components/meeting/summary-panel.tsx`:
     - Display AI-generated summary
     - Key points, decisions, action items as separate sections
     - Use shadcn `Card` + `Separator`

5. **Build MoM preview**
   - `src/components/meeting/mom-preview.tsx`:
     - Professional document-style layout
     - Editable sections
     - Copy-to-clipboard button
     - Print-friendly styling

---

### Phase 6: Polish & Export

> Final UX improvements, export options, and edge case handling.

#### Tasks

1. **Export functionality**
   - Copy MoM as plain text
   - Copy MoM as Markdown
   - Print-to-PDF (browser native `window.print()`)

2. **Error handling & edge cases**
   - Audio validation before upload (format, size, duration)
   - Transcription failure → show error + retry button
   - AI failure → show error + retry with same transcript
   - Network failure → toast notification with retry
   - Session expiry → redirect to login

3. **Loading states**
   - Dashboard: skeleton cards while loading
   - Meeting detail: skeleton panels for each section
   - Processing: animated progress indicator

4. **Toast notifications** (via sonner)
   ```bash
   bunx --bun shadcn@latest add sonner
   ```
   - Meeting created successfully
   - Audio uploaded successfully
   - Transcription complete
   - MoM generated
   - Error messages

5. **Responsive design**
   - Dashboard: single column on mobile, grid on desktop
   - Meeting detail: stacked panels on mobile, side-by-side on desktop
   - Sidebar: collapsible on mobile (Sheet-based)

6. **Landing page** (root `/`)
   - Brief hero section explaining the app
   - CTA to login/signup
   - Clean, minimal, SaaS feel

---

## 8. shadcn Components Required

Full list of shadcn components to install:

```bash
bunx --bun shadcn@latest add \
  card input field separator avatar dropdown-menu sidebar badge spinner alert \
  dialog empty skeleton scroll-area tooltip progress \
  tabs textarea sonner
```

**Already installed:** `button`

**Total new components:** ~17

---

## 9. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GROQ_API_KEY=your-groq-api-key
```

---

## 10. Dependencies to Install

```bash
# Core backend dependencies
bun add @supabase/supabase-js @supabase/ssr groq-sdk

# No additional frontend dependencies needed
# shadcn components are added via CLI (not bun add)
```

---

## 11. Verification Plan

### Automated Checks

| Check | Command | When |
|-------|---------|------|
| TypeScript compilation | `bun run build` | After each phase |
| Linting | `bun run lint` | After each phase |
| Dev server runs | `bun run dev` | After each phase |

### Manual Verification (per phase)

| Phase | Verification |
|-------|-------------|
| Phase 1 | User can sign up, log in, see sidebar layout, log out |
| Phase 2 | User can create/view/delete meetings from dashboard |
| Phase 3 | User can record audio in browser, upload audio file, see it stored |
| Phase 4 | Audio gets transcribed, transcript is displayed and editable |
| Phase 5 | Summary and MoM are generated from transcript, displayed properly |
| Phase 6 | Export works, error states handled, responsive on mobile |

---

## 12. Open Questions for User

> [!IMPORTANT]
> Please clarify the following before implementation begins:

1. **Supabase project:** Do you already have a Supabase project set up, or should I guide you through creating one?

2. **Groq API key:** Do you have a Groq account/API key, or would you prefer a different free AI provider (e.g., Google Gemini)?

3. **OAuth providers:** Should login support only email/password, or also Google/GitHub OAuth?

4. **The `globals_claude.css` anomaly:** Your `components.json` points to `src/styles/globals_claude.css` but the app layout imports `@/styles/globals.css`. Which CSS file should be the active one? (I will not modify either — just need to know which one the app should import.)

5. **Logo usage:** The public folder has `FCLogo.svg` and `FCLogoSquareCentered.svg`. Should these be used in the sidebar/header, or do you have a different MoM logo in mind?

6. **Shadcn MCP Server:** Per AGENTS.md rule 1.1, should I prompt you to install the shadcn MCP Server? For VSCode:
   ```bash
   bunx --bun shadcn@latest mcp init --client vscode
   ```

---

## 13. Estimated Effort

| Phase | Estimated Time | Dependencies |
|-------|---------------|--------------|
| Phase 1: Foundation & Auth | ~4-5 hours | Supabase project + env vars |
| Phase 2: Dashboard & CRUD | ~3-4 hours | Phase 1 complete |
| Phase 3: Audio Input | ~4-5 hours | Phase 2 complete |
| Phase 4: Transcription | ~3-4 hours | Phase 3 + Groq API key |
| Phase 5: AI Summary & MoM | ~4-5 hours | Phase 4 complete |
| Phase 6: Polish & Export | ~3-4 hours | Phase 5 complete |
| **Total** | **~21-27 hours** | |

---

## 14. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Groq free-tier rate limits | Implement request queuing and retry with exponential backoff |
| Large audio files (>25MB Groq limit) | Validate file size on upload, chunk if needed |
| Browser audio API compatibility | Feature-detect `MediaRecorder`, show fallback upload option |
| Supabase free-tier storage limits (1GB) | Monitor usage, compress audio before upload |
| Next.js 16 breaking changes | Verify APIs against actual installed version before coding |
