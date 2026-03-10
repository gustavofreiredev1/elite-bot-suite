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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    const { action, ...body } = await req.json();

    switch (action) {
      case "validate_token": {
        const { telegram_token } = body;
        if (!telegram_token || typeof telegram_token !== "string" || telegram_token.length < 30) {
          return new Response(JSON.stringify({ error: "Token inválido" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Validate with Telegram API
        const tgRes = await fetch(`https://api.telegram.org/bot${telegram_token}/getMe`);
        const tgData = await tgRes.json();

        if (!tgData.ok) {
          return new Response(JSON.stringify({ error: "Token do Telegram inválido. Verifique e tente novamente." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({
          valid: true,
          bot_info: {
            id: tgData.result.id,
            username: tgData.result.username,
            first_name: tgData.result.first_name,
          },
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "connect_bot": {
        const { telegram_token, bot_name } = body;
        if (!telegram_token) {
          return new Response(JSON.stringify({ error: "Token obrigatório" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Validate token first
        const tgRes = await fetch(`https://api.telegram.org/bot${telegram_token}/getMe`);
        const tgData = await tgRes.json();
        if (!tgData.ok) {
          return new Response(JSON.stringify({ error: "Token inválido" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const botUsername = tgData.result.username;
        const botDisplayName = bot_name || tgData.result.first_name;

        // Set webhook
        const webhookUrl = `${supabaseUrl}/functions/v1/telegram-webhook?bot_token=${telegram_token}`;
        const whRes = await fetch(`https://api.telegram.org/bot${telegram_token}/setWebhook`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: webhookUrl }),
        });
        const whData = await whRes.json();

        if (!whData.ok) {
          return new Response(JSON.stringify({ error: "Erro ao configurar webhook" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Save bot to database
        const { data: bot, error: botError } = await supabase
          .from("bots")
          .insert({
            user_id: userId,
            name: botDisplayName,
            telegram_token: telegram_token,
            telegram_bot_username: botUsername,
            webhook_url: webhookUrl,
            is_active: true,
            status: "connected",
          })
          .select()
          .single();

        if (botError) {
          // Check for duplicate
          if (botError.code === "23505") {
            return new Response(JSON.stringify({ error: "Este bot já está conectado" }), {
              status: 409,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify({ error: botError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true, bot }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "disconnect_bot": {
        const { bot_id } = body;

        const { data: bot } = await supabase
          .from("bots")
          .select("telegram_token")
          .eq("id", bot_id)
          .eq("user_id", userId)
          .single();

        if (bot?.telegram_token) {
          await fetch(`https://api.telegram.org/bot${bot.telegram_token}/deleteWebhook`);
        }

        await supabase
          .from("bots")
          .update({ is_active: false, status: "disconnected", webhook_url: null })
          .eq("id", bot_id)
          .eq("user_id", userId);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "send_message": {
        const { bot_id, chat_id, text } = body;
        if (!bot_id || !chat_id || !text) {
          return new Response(JSON.stringify({ error: "Campos obrigatórios faltando" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data: bot } = await supabase
          .from("bots")
          .select("telegram_token")
          .eq("id", bot_id)
          .eq("user_id", userId)
          .single();

        if (!bot?.telegram_token) {
          return new Response(JSON.stringify({ error: "Bot não encontrado" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const tgRes = await fetch(`https://api.telegram.org/bot${bot.telegram_token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id, text }),
        });
        const tgData = await tgRes.json();

        if (tgData.ok) {
          // Get or create conversation
          let { data: conv } = await supabase
            .from("conversations")
            .select("id")
            .eq("bot_id", bot_id)
            .eq("telegram_chat_id", chat_id)
            .single();

          if (!conv) {
            const { data: newConv } = await supabase
              .from("conversations")
              .insert({ bot_id, telegram_chat_id: chat_id, chat_title: `Chat ${chat_id}` })
              .select("id")
              .single();
            conv = newConv;
          }

          if (conv) {
            await supabase.from("messages").insert({
              conversation_id: conv.id,
              bot_id,
              telegram_message_id: tgData.result.message_id,
              sender_type: "bot",
              content: text,
            });

            await supabase
              .from("conversations")
              .update({ last_message_at: new Date().toISOString() })
              .eq("id", conv.id);
          }
        }

        return new Response(JSON.stringify({ success: tgData.ok, result: tgData.result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_bots": {
        const { data: bots, error } = await supabase
          .from("bots")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        return new Response(JSON.stringify({ bots: bots || [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Ação inválida" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
