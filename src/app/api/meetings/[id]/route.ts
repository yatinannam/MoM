import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { id } = params

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: meeting, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("meeting_id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(meeting)
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { id } = params

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Only allow updating specific fields
    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.date !== undefined) updateData.date = body.date
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status
    updateData.updated_at = new Date().toISOString()

    const { data: meeting, error } = await supabase
      .from("meetings")
      .update(updateData)
      .eq("meeting_id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(meeting)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
