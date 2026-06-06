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
    const { meeting_id, storage_url, file_name, file_size } = body

    if (!meeting_id || !storage_url) {
      return NextResponse.json({ error: "meeting_id and storage_url are required" }, { status: 400 })
    }

    const { data: audioFile, error } = await supabase
      .from("audio_files")
      .insert([
        {
          meeting_id,
          storage_url,
          file_name: file_name || null,
          file_size: file_size || null
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(audioFile)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
