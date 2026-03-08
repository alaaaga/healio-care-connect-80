import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [profile, setProfile] = useState<{ full_name: string; phone: string } | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const loadUserData = async (userId: string) => {
      try {
        const [{ data: profileData }, { data: roleData }, { data: docData }] = await Promise.all([
          supabase.from('profiles').select('full_name, phone').eq('user_id', userId).single(),
          supabase.from('user_roles').select('role').eq('user_id', userId),
          supabase.from('doctors').select('*').eq('user_id', userId).maybeSingle(),
        ]);
        if (!mountedRef.current) return;
        setProfile(profileData);
        setIsAdmin(roleData?.some(r => r.role === 'admin') ?? false);
        setIsDoctor(roleData?.some(r => r.role === 'doctor') ?? false);
        setDoctorProfile(docData);
      } catch {
        if (!mountedRef.current) return;
        setProfile(null);
        setIsAdmin(false);
        setIsDoctor(false);
        setDoctorProfile(null);
      }
      if (mountedRef.current) setLoading(false);
    };

    // Get session first, then set up listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mountedRef.current) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mountedRef.current) return;
        // Only handle actual changes, not INITIAL_SESSION
        if (event === 'INITIAL_SESSION') return;
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          loadUserData(session.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsDoctor(false);
          setDoctorProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, session, loading, isAdmin, isDoctor, doctorProfile, profile, signOut };
}
