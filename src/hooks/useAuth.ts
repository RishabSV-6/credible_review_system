import { useState, useEffect, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | null = null;

    try {
      const supabase = getSupabase();

      supabase.auth
        .getSession()
        .then(({ data }) => {
          if (!mounted) return;
          setSession(data.session);
          setUser(data.session?.user ?? null);
        })
        .catch(() => {})
        .finally(() => {
          if (mounted) setLoading(false);
        });

      const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
        if (!mounted) return;
        setSession(sess);
        setUser(sess?.user ?? null);
        setLoading(false);
      });

      unsubscribe = () => listener.subscription.unsubscribe();
    } catch {
      if (mounted) setLoading(false);
    }

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { data, error };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }, []);

  return { session, user, loading, signUp, signIn, signOut };
}
