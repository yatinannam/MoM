# Meeting Minutes (MoM) Generator Web App

## 1. Project Overview

### What the project is

This project is a web application that helps users automatically create Minutes of Meeting (MoM) from meeting audio. The user can either record audio inside the app or upload an existing audio file. The system then converts the speech into text, processes the transcript using AI, and generates a clear meeting summary and MoM format.

### Why it is useful

Writing meeting minutes manually takes time and attention. Important points can be missed, especially in long meetings or meetings with multiple speakers. This project reduces that workload by automating the main steps of recording, transcription, summarization, and MoM creation.

### The main problem it solves

The main problem is the difficulty of converting spoken discussion into a well-structured written meeting record. People often spend too much time listening again, taking notes, and organizing information after meetings. This application helps automate that process and produces a cleaner final output.

### Who will use it

This app can be useful for:

- Students working on projects or group discussions
- Team leads and club members
- Startups and small teams
- Teachers, trainers, and coordinators
- Anyone who wants a quick and organized meeting record

---

## 2. User Workflow / User Flow

This section explains the complete journey of the user from opening the app to getting the final MoM output.

### Step 1: Authentication / Login

The user opens the application and signs in using a secure login system. Authentication helps keep meeting records private and allows each user to access their own saved meetings.

### Step 2: Dashboard

After logging in, the user reaches the dashboard. This page shows:

- Previously created meetings
- Button to start a new meeting
- Status of ongoing processing
- Quick access to saved MoMs

### Step 3: Create Meeting Session

The user creates a new meeting session by entering basic details such as:

- Meeting title
- Date and time
- Optional description or agenda
- Participants or team name

### Step 4: Record Audio or Upload Audio

The user chooses one of two options:

- Record audio live directly in the browser
- Upload an existing audio file from the device

This makes the app flexible for both live meetings and already recorded discussions.

### Step 5: Speech-to-Text Conversion

Once the audio is uploaded or recorded, the system converts the speech into text. This transcript becomes the base input for the AI summary and MoM generation.

### Step 6: Transcript Review

The user can view the transcript and check whether the speech was correctly converted. Minor corrections can be made before generating the final meeting summary.

### Step 7: AI Summary Generation

The AI processes the transcript and extracts the most important points from the meeting. It identifies the key decisions, discussion topics, and action items.

### Step 8: MoM Generation

The system arranges the summary into a proper MoM format. This may include:

- Meeting title
- Date
- Attendees
- Agenda
- Discussion points
- Decisions made
- Action items
- Next steps

### Step 9: Edit / Save / Export / Share

The user can then:

- Edit the generated MoM
- Save it to the account
- Export it in a useful format
- Share it with team members

---

## 3. Feature Breakdown

### Login / Signup

The app should allow users to create an account and log in securely. This makes the experience personal and lets users access saved meetings later.

### Meeting Creation

Users should be able to create a new meeting record with a title, date, and optional notes. This helps keep all meetings organized.

### Audio Recording

The app should include a simple record button so users can capture live meeting audio directly in the browser.

### Audio Upload

If the meeting has already been recorded elsewhere, the user should be able to upload the file instead of recording again.

### Transcript Generation

The application should convert spoken audio into text so that the meeting content becomes readable and searchable.

### AI Summary

The transcript should be processed by AI to identify important points and convert them into a clean summary.

### MoM Formatting

The summary should be turned into a formal MoM structure that looks neat and professional.

### History / Saved Meetings

Users should be able to revisit older meetings from the dashboard. This creates a simple record system.

### Edit and Export Options

Users should be able to edit the final output before saving or exporting it. This is important because AI-generated content may need small corrections.

---

## 4. Workflow Design

### Frontend Flow

The frontend is the part the user sees and interacts with. It should:

- Show the login page
- Show the dashboard
- Allow meeting creation
- Provide record/upload controls
- Display transcript, summary, and MoM results
- Allow editing and export

### Backend Flow

The backend handles the actual processing. It should:

- Receive audio file data
- Store file information safely
- Send audio for transcription
- Receive transcript output
- Send transcript to AI summarization logic
- Return the final MoM structure to the frontend

### Database Flow

The database should store meeting-related data such as:

- User account details
- Meeting metadata
- Transcript text
- AI summary
- Final MoM
- File link or storage path
- Processing status

### How audio moves through the system

1. User records or uploads audio
2. Audio is stored temporarily or uploaded to cloud storage
3. Backend sends audio to transcription service
4. Transcript is generated
5. Transcript is sent to AI for summarization
6. Summary is converted into MoM format
7. Final output is shown on the dashboard

### How transcript data is stored and used

The transcript can be stored in the database so the user can:

- Review it later
- Edit it if needed
- Re-generate MoM without uploading the audio again
- Search past meetings more easily

### How the final output is generated

The final output is created by combining:

- Basic meeting details
- Transcript content
- AI-generated summary
- Structured MoM sections

This final document should be easy to read and ready to share.

---

## 5. Tech Stack Explanation

### Next.js

Next.js is used for the frontend and application structure because it is modern, fast, and good for building full web apps. It supports routing, server features, and clean app organization.

### shadcn/ui

shadcn/ui is used for the user interface because it gives clean, reusable, and customizable components. It helps make the app look polished without needing to design everything from scratch.

### Supabase

Supabase is used for authentication, database, and backend support. It is a very good choice for a student project because it offers free-tier features and simplifies backend setup.

### Free / Open-source transcription options

For speech-to-text, the project should use a free or open-source transcription tool. This keeps the project within budget and makes it realistic for a student build.

### Free / Open-source AI options

For the summary and MoM generation, the project should use a free AI model or open-source model. This helps keep the system free-tier only and avoids dependency on costly APIs.

### Other supporting tools

Possible supporting tools may include:

- Tailwind CSS for styling
- Browser audio APIs for recording
- File upload utilities
- Simple validation libraries

---

## 6. Architecture

### Frontend layer

This layer handles the user interface. It includes pages, forms, buttons, audio controls, and result display sections.

### Backend/API layer

This layer processes the audio, handles requests, performs transcription, and generates AI summaries.

### Database layer

This layer stores all important data such as users, meetings, transcripts, summaries, and final MoMs.

### AI / transcription layer

This layer is responsible for converting audio to text and then text to summary/MoM.

### File storage layer

This layer stores uploaded audio files safely so they can be used later if needed.

### Simple architecture view

```
User → Frontend → Backend/API → Transcription → AI Summary → Database → Final MoM → User
```

---

## 7. Advantages

- **Time saving** — The app reduces the time needed to write meeting minutes manually.
- **Better meeting documentation** — It creates a more structured and organized output than casual handwritten notes.
- **Easy access to records** — Saved meetings can be accessed later whenever needed.
- **Improved productivity** — Team members can focus more on the discussion instead of note-taking.
- **Automation of manual work** — The app automates repeated tasks like transcription, summarization, and formatting.

---

## 8. Disadvantages / Limitations

- **Noisy audio may affect transcription** — If the audio quality is poor, the transcript may contain errors.
- **Multiple speakers can create confusion** — When many people talk at once, the system may struggle to separate voices correctly.
- **AI may miss context** — The summary may not always capture the full meaning of the discussion.
- **Long audio may take time to process** — Large files can increase processing time.
- **Manual correction may still be required** — Users may still need to edit the final output before using it.
- **Dependence on internet or service availability** — If the server or internet connection fails, the workflow may stop.

---

## 9. Edge Cases / Problems That May Occur

| Problem | Description |
|---------|-------------|
| Poor audio quality | The recording may have low volume or unclear speech. |
| Background noise | Environmental noise may reduce transcription accuracy. |
| Speaker overlap | Two or more people speaking at the same time may make the transcript inaccurate. |
| Incomplete audio upload | The file may fail to upload fully or may get corrupted. |
| Transcription errors | Some words may be wrongly recognized by the speech-to-text system. |
| AI generating wrong summaries | The AI may misunderstand the transcript and create an inaccurate summary. |
| Large file handling | Very long meetings may exceed limits or take too much time. |
| Login / session issues | The user may get logged out or fail to authenticate properly. |
| Storage or database failure | The file or meeting data may not be saved properly. |
| User edits not saving properly | The final MoM may be edited, but changes may fail to store. |

---

## 10. How to Solve These Issues

| Problem | Solution |
|---------|----------|
| Poor audio quality | Provide a clear recording interface, show mic status, and suggest using a good microphone. |
| Background noise | Use basic noise reduction guidance and advise recording in a quiet place. |
| Speaker overlap | Mention that users should speak one at a time for better accuracy. |
| Incomplete audio upload | Add upload progress indicators and file validation. |
| Transcription errors | Allow transcript editing before final MoM generation. |
| Wrong summaries | Keep the transcript visible so the user can compare the result and correct it. |
| Large file handling | Limit file size or process long files in smaller chunks. |
| Login issues | Use a stable authentication flow with clear error messages. |
| Storage/database failure | Add retry logic and proper error handling. |
| Edits not saving | Use autosave or manual save with success confirmation. |

---

## 11. Database / Data Handling Idea

Using Supabase, the app can store the following data:

### Supabase Schema

```
Users
├── user_id
├── name
└── email

Meetings
├── meeting_id
├── user_id
├── title
├── date
└── status

AudioFiles
├── file_id
├── meeting_id
└── storage_url

Transcripts
├── transcript_id
├── meeting_id
└── transcript_text

Summaries
├── summary_id
├── meeting_id
└── summary_text

MoMs
├── mom_id
├── meeting_id
└── mom_content
```

### Processing Status Values

- `uploaded`
- `transcribing`
- `summarizing`
- `completed`
- `failed`

---

## 12. UI / UX Ideas

- **Dashboard** — Show all saved meetings in a clean card layout with a clear button to start a new meeting.
- **Record button** — A large and visible record button on the meeting page.
- **Upload section** — Simple and drag-and-drop friendly.
- **Transcript panel** — Display the generated transcript in a readable format with edit options.
- **Summary panel** — Show a short AI-generated summary of the discussion.
- **MoM preview** — Final meeting minutes in a professional, document-style layout.
- **Save / export controls** — Save, copy, or export the final output easily.

### Overall design style

The interface should be: Clean, Minimal, Easy to navigate, Beginner-friendly, Professional enough for real use.

---

## 13. Future Scope

- **Speaker identification** — Identify different speakers in the meeting.
- **Action item extraction** — Automatically detect tasks assigned to different people.
- **Calendar integration** — Connect meeting details to calendar events.
- **PDF export** — Download the final MoM as a PDF file.
- **Team collaboration** — Multiple users can work on the same meeting record.
- **Live meeting mode** — Support live transcription during ongoing meetings.

---

## 14. Conclusion

This project is a practical and useful student-level web application that automates the process of creating Minutes of Meeting. It combines audio capture, transcription, AI summarization, and structured MoM generation into one simple workflow. With a clean frontend in Next.js, reusable UI with shadcn/ui, and backend support from Supabase, the project can be built in a modern and organized way using free-tier tools.

---

## Quick Reference

**Project in one line:** A web app that records or uploads meeting audio, converts it into text, and generates a structured summary and Minutes of Meeting using AI.

**Core flow:** `Login → Create meeting → Record/upload audio → Convert speech to text → Generate summary → Create MoM → Save/export`

**Main stack:**

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js |
| UI | shadcn/ui |
| Backend/Auth/DB | Supabase |
| Transcription | Free/open-source tool |
| AI summary | Free/open-source model |

---

## Diagrams

### High-Level User Flow

```
Authentication → Dashboard → Create Meeting → Record / Upload Audio
→ Speech-to-Text Processing → Transcript Generation → Transcript Review
→ AI Summary Generation → MoM Generation → Edit & Validation
→ Save / Export / Share → Meeting Archive
```

### System Workflow

```
User
  ↓
Frontend (Next.js)
  • Dashboard
  • Meeting Creation
  • Audio Recording / Upload
  • Transcript Viewer
  ↓
Supabase
  • Authentication
  • Database
  • Storage
  ↓
Speech-to-Text Processing
  ↓
Transcript Generated
  ↓
AI Engine
  • Summarization
  • MoM Generation
  ↓
Summary + Final MoM
  ↓
Save to Supabase Database
  ↓
Display Results on Frontend → User
```

### Application Architecture

```
┌───────────────────────────┐
│        Frontend           │
│  Next.js + shadcn/ui      │
│  Dashboard, Recorder      │
│  Transcript & MoM Viewer  │
└────────────┬──────────────┘
             │
┌────────────▼──────────────┐
│        Supabase           │
│  Authentication           │
│  Database                 │
│  Storage                  │
│  API Layer                │
└────────────┬──────────────┘
             │
┌────────────▼──────────────┐
│   AI Processing Layer     │
│  Speech-to-Text           │
│  AI Summarization         │
│  MoM Generation           │
└───────────────────────────┘
```

### Database Flow

```
User Creates Meeting → Meeting Metadata Saved → Audio Uploaded
→ Storage URL Generated → Transcript Saved → Summary Saved
→ MoM Saved → Displayed in Dashboard
```

### Error & Edge Case Flow

```
Audio Submitted → Audio Validation
  ├── Valid → Process → Transcription
  │     ├── Success → AI Step → MoM Generated
  │     └── Failed → Retry Option
  └── Invalid → Show Error
```
