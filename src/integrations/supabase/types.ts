export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bot_flows: {
        Row: {
          bot_id: string
          created_at: string
          description: string | null
          edges: Json | null
          id: string
          is_active: boolean
          name: string
          nodes: Json | null
          trigger_command: string | null
          updated_at: string
        }
        Insert: {
          bot_id: string
          created_at?: string
          description?: string | null
          edges?: Json | null
          id?: string
          is_active?: boolean
          name: string
          nodes?: Json | null
          trigger_command?: string | null
          updated_at?: string
        }
        Update: {
          bot_id?: string
          created_at?: string
          description?: string | null
          edges?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          nodes?: Json | null
          trigger_command?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_flows_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      bots: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          status: string
          telegram_bot_username: string | null
          telegram_token: string | null
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          status?: string
          telegram_bot_username?: string | null
          telegram_token?: string | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          status?: string
          telegram_bot_username?: string | null
          telegram_token?: string | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          bot_id: string
          chat_title: string | null
          chat_type: string | null
          created_at: string
          id: string
          last_message_at: string | null
          telegram_chat_id: number
        }
        Insert: {
          bot_id: string
          chat_title?: string | null
          chat_type?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          telegram_chat_id: number
        }
        Update: {
          bot_id?: string
          chat_title?: string | null
          chat_type?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          telegram_chat_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "conversations_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          current_uses: number
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          product_id: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          product_id?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          product_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          bot_id: string
          content: string | null
          conversation_id: string
          created_at: string
          id: string
          message_type: string | null
          sender_name: string | null
          sender_type: string
          telegram_message_id: number | null
        }
        Insert: {
          bot_id: string
          content?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string | null
          sender_name?: string | null
          sender_type?: string
          telegram_message_id?: number | null
        }
        Update: {
          bot_id?: string
          content?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string | null
          sender_name?: string | null
          sender_type?: string
          telegram_message_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          buyer_email: string | null
          buyer_name: string | null
          buyer_phone: string | null
          buyer_telegram_id: number | null
          coupon_code: string | null
          created_at: string
          delivered_at: string | null
          external_payment_id: string | null
          id: string
          metadata: Json | null
          net_amount: number
          paid_at: string | null
          payment_method: string
          pix_code: string | null
          pix_qr_code: string | null
          platform_fee: number
          product_id: string
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          buyer_telegram_id?: number | null
          coupon_code?: string | null
          created_at?: string
          delivered_at?: string | null
          external_payment_id?: string | null
          id?: string
          metadata?: Json | null
          net_amount?: number
          paid_at?: string | null
          payment_method?: string
          pix_code?: string | null
          pix_qr_code?: string | null
          platform_fee?: number
          product_id: string
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_email?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          buyer_telegram_id?: number | null
          coupon_code?: string | null
          created_at?: string
          delivered_at?: string | null
          external_payment_id?: string | null
          id?: string
          metadata?: Json | null
          net_amount?: number
          paid_at?: string | null
          payment_method?: string
          pix_code?: string | null
          pix_qr_code?: string | null
          platform_fee?: number
          product_id?: string
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string
          features: Json | null
          id: string
          is_active: boolean
          max_bots: number
          max_flows: number
          max_messages_per_month: number
          name: string
          price_monthly: number
          price_yearly: number
          slug: string
        }
        Insert: {
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean
          max_bots?: number
          max_flows?: number
          max_messages_per_month?: number
          name: string
          price_monthly?: number
          price_yearly?: number
          slug: string
        }
        Update: {
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean
          max_bots?: number
          max_flows?: number
          max_messages_per_month?: number
          name?: string
          price_monthly?: number
          price_yearly?: number
          slug?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          bot_id: string | null
          checkout_config: Json | null
          created_at: string
          currency: string
          delivery_content: string | null
          delivery_type: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          order_bump_product_id: string | null
          price: number
          product_type: string
          slug: string
          updated_at: string
          upsell_product_id: string | null
          user_id: string
        }
        Insert: {
          bot_id?: string | null
          checkout_config?: Json | null
          created_at?: string
          currency?: string
          delivery_content?: string | null
          delivery_type?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          order_bump_product_id?: string | null
          price?: number
          product_type?: string
          slug: string
          updated_at?: string
          upsell_product_id?: string | null
          user_id: string
        }
        Update: {
          bot_id?: string | null
          checkout_config?: Json | null
          created_at?: string
          currency?: string
          delivery_content?: string | null
          delivery_type?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          order_bump_product_id?: string | null
          price?: number
          product_type?: string
          slug?: string
          updated_at?: string
          upsell_product_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          onboarding_completed: boolean
          plan_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          plan_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          plan_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string
          external_subscription_id: string | null
          id: string
          payment_method: string | null
          plan_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          external_subscription_id?: string | null
          id?: string
          payment_method?: string | null
          plan_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string
          external_subscription_id?: string | null
          id?: string
          payment_method?: string | null
          plan_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_stats: {
        Row: {
          active_conversations: number
          bot_id: string | null
          created_at: string
          id: string
          messages_received: number
          messages_sent: number
          period_start: string
          user_id: string
        }
        Insert: {
          active_conversations?: number
          bot_id?: string | null
          created_at?: string
          id?: string
          messages_received?: number
          messages_sent?: number
          period_start?: string
          user_id: string
        }
        Update: {
          active_conversations?: number
          bot_id?: string | null
          created_at?: string
          id?: string
          messages_received?: number
          messages_sent?: number
          period_start?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_stats_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          pending_balance: number
          total_earned: number
          total_withdrawn: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string
          id: string
          pix_key: string
          pix_key_type: string
          processed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          pix_key: string
          pix_key_type?: string
          processed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          pix_key?: string
          pix_key_type?: string
          processed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_bot_owner: { Args: { _bot_id: string }; Returns: boolean }
      is_conversation_owner: { Args: { _conv_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
