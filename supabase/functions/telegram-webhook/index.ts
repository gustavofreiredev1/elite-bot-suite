import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const botToken = url.searchParams.get("bot_token");

    if (!botToken) {
      return new Response("Missing bot_token", { status: 400 });
    }

    const update = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Find the bot by token
    const { data: bot } = await supabase
      .from("bots")
      .select("id, user_id")
      .eq("telegram_token", botToken)
      .eq("is_active", true)
      .single();

    if (!bot) {
      return new Response("Bot not found", { status: 404 });
    }

    // Process message
    const message = update.message || update.edited_message;
    if (!message) {
      return new Response("OK", { status: 200 });
    }

    const chatId = message.chat.id;
    const chatTitle = message.chat.title || message.chat.first_name || `Chat ${chatId}`;
    const chatType = message.chat.type || "private";
    const senderName = message.from?.first_name || "Unknown";
    const text = message.text || "";

    // Get or create conversation
    let { data: conv } = await supabase
      .from("conversations")
      .select("id")
      .eq("bot_id", bot.id)
      .eq("telegram_chat_id", chatId)
      .single();

    if (!conv) {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert({
          bot_id: bot.id,
          telegram_chat_id: chatId,
          chat_title: chatTitle,
          chat_type: chatType,
        })
        .select("id")
        .single();
      conv = newConv;
    }

    if (!conv) {
      return new Response("Failed to create conversation", { status: 500 });
    }

    // Save message
    await supabase.from("messages").insert({
      conversation_id: conv.id,
      bot_id: bot.id,
      telegram_message_id: message.message_id,
      sender_type: "user",
      sender_name: senderName,
      content: text,
      message_type: message.photo ? "photo" : message.document ? "document" : "text",
    });

    // Update conversation last_message_at
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString(), chat_title: chatTitle })
      .eq("id", conv.id);

    // Check for bot flows (auto-reply)
    if (text.startsWith("/")) {
      const command = text.split(" ")[0].split("@")[0]; // Handle /command@botname

      const { data: flows } = await supabase
        .from("bot_flows")
        .select("*")
        .eq("bot_id", bot.id)
        .eq("is_active", true)
        .eq("trigger_command", command);

      if (flows && flows.length > 0) {
        const flow = flows[0];
        const nodes = flow.nodes as any[];

        // Find first message node
        const msgNode = nodes.find((n: any) => n.data?.type === "message");
        if (msgNode?.data?.config?.message) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: msgNode.data.config.message,
              parse_mode: "HTML",
            }),
          });

          // Save bot response
          await supabase.from("messages").insert({
            conversation_id: conv.id,
            bot_id: bot.id,
            sender_type: "bot",
            content: msgNode.data.config.message,
          });
        }
      }
    }

    // Update usage stats
    const today = new Date().toISOString().split("T")[0];
    const { data: stats } = await supabase
      .from("usage_stats")
      .select("id, messages_received")
      .eq("user_id", bot.user_id)
      .eq("bot_id", bot.id)
      .eq("period_start", today)
      .single();

    if (stats) {
      await supabase
        .from("usage_stats")
        .update({ messages_received: stats.messages_received + 1 })
        .eq("id", stats.id);
    } else {
      await supabase.from("usage_stats").insert({
        user_id: bot.user_id,
        bot_id: bot.id,
        period_start: today,
        messages_received: 1,
      });
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal error", { status: 500 });
  }
});
