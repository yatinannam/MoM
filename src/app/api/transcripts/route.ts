import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { meeting_id, transcript_text, edited_text } = body

    if (!meeting_id || !transcript_text) {
      return NextResponse.json({ error: "meeting_id and transcript_text are required" }, { status: 400 })
    }

    const { data: transcript, error } = await supabase
      .from("transcripts")
      .insert([
        {
          meeting_id,
          transcript_text,
          edited_text: edited_text || null
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(transcript)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { transcript_id, edited_text } = body

    if (!transcript_id || !edited_text) {
      return NextResponse.json({ error: "transcript_id and edited_text are required" }, { status: 400 })
    }

    const { data: transcript, error } = await supabase
      .from("transcripts")
      .update({
        edited_text,
        updated_at: new Date().toISOString()
      })
      .eq("transcript_id", transcript_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(transcript)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
