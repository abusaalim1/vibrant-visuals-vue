import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, type UserProfile, type Couple } from "./supabase";

type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  couple: Couple | null;
  partner: UserProfile | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

async function fetchProfile(authId: string): Promise<UserProfile | null> {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", authId)
    .maybeSingle();
  return (data as UserProfile) ?? null;
}

async function fetchCouple(userId: string): Promise<Couple | null> {
  const { data } = await supabase
    .from("couples")
    .select("*")
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Couple) ?? null;
}

async function fetchPartnerProfile(
  couple: Couple | null,
  userId: string,
): Promise<UserProfile | null> {
  if (!couple) return null;
  const partnerAuthId =
    couple.user1_id === userId ? couple.user2_id : couple.user1_id;
  if (!partnerAuthId) return null;
  // partner auth id → find their users row via user metadata email lookup
  // We don't have auth_uid column, so try to match via a secondary rpc.
  // Fallback: return null (UI handles gracefully).
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partner, setPartner] = useState<UserProfile | null>(null);

  const hydrate = useCallback(async (s: Session | null) => {
    setSession(s);
    if (!s?.user) {
      setProfile(null);
      setCouple(null);
      setPartner(null);
      return;
    }
    const email = s.user.email ?? "";
    const p = await fetchProfile(email);
    setProfile(p);
    const c = await fetchCouple(s.user.id);
    setCouple(c);
    setPartner(await fetchPartnerProfile(c, s.user.id));
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    await hydrate(data.session);
  }, [hydrate]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      await hydrate(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      await hydrate(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [hydrate]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setCouple(null);
    setPartner(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        session,
        user: session?.user ?? null,
        profile,
        couple,
        partner,
        refresh,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
