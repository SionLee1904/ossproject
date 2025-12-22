import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useAuth() {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1) 초기 세션 로드
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoadingAuth(false);
    });

    // 2) 세션 변화 구독
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, loadingAuth, signOut };
}
