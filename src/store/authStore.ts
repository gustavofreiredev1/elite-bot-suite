import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan_id: string | null;
  onboarding_completed: boolean;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;

    // Listen for auth changes FIRST
    supabase.auth.onAuthStateChange(async (event, session) => {
      set({
        user: session?.user ?? null,
        session,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });

      if (session?.user) {
        // Defer profile fetch to avoid deadlock
        setTimeout(() => get().fetchProfile(), 0);
      } else {
        set({ profile: null });
      }
    });

    // Then get current session
    const { data: { session } } = await supabase.auth.getSession();
    set({
      user: session?.user ?? null,
      session,
      isAuthenticated: !!session?.user,
      isLoading: false,
      initialized: true,
    });

    if (session?.user) {
      await get().fetchProfile();
    }
  },

  fetchProfile: async () => {
    const user = get().user;
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      set({ profile: data as Profile });
    }
  },

  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  register: async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null, isAuthenticated: false });
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const user = get().user;
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (!error) {
      await get().fetchProfile();
    }
  },
}));
