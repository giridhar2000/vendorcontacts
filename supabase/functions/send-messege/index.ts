// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabase = createClient(Deno.env.get(`SB_URL`), Deno.env.get(`SB_ANON_KEY`), { persistSession: false })

serve(async (req) => {
  const { record } = await req.json()


  // // Inserting chat notification for a chat
  // const { data: chat_notifications, error: chat_error } = await supabase
  //   .from('chat_notifications')
  //   .insert([
  //     { sender_id: record.sender_id, reciver_id: record.reciver_id, chat_id: record.chat_id, message_id: record.id },
  //   ])

  // // Inserting header notification for a user
  // const { data: header_notifications, error: header_error } = await supabase
  //   .from('header_notifications')
  //   .insert([
  //     { reciver_id: record.reciver_id, chat_id: record.chat_id },
  //   ])

  // Updating latest message in a chat
  const { data: updating_latest_message, error: latest_message } = await supabase
    .from('chats')
    .update({ recent_message: record.text })
    .eq('chat_id', record.chat_id)
    .single()




  return new Response('ok')
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
