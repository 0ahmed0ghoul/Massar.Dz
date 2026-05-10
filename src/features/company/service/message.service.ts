// features/company/services/message.service.ts
import { supabase } from "@/lib/supabaseClient";

export async function sendBulkMessages(applicationIds: string[], message: string) {
  // Fetch student IDs from the applications
  const { data: applications, error: fetchError } = await supabase
    .from("applications")
    .select("student_id")
    .in("id", applicationIds);
  if (fetchError) throw new Error(fetchError.message);

  // Get the current authenticated user (company admin)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Prepare messages with correct column names
  const messages = applications.map((app) => ({
    sender_id: user.id,
    receiver_id: app.student_id,
    content: message,        // ✅ column is 'content', not 'message'
    read: false,
    created_at: new Date().toISOString(),
  }));

  const { error: insertError } = await supabase.from("messages").insert(messages);
  if (insertError) throw new Error(insertError.message);
}