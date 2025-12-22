import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 이미 로그인 상태면 홈으로
  if (user) {
    navigate("/", { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("회원가입 성공! (설정에 따라 이메일 인증이 필요할 수 있어요) 로그인 해주세요.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setMsg(err?.message ?? "로그인/회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "0 16px", maxWidth: "520px", margin: "0 auto" }}>
      <h1>{mode === "signup" ? "회원가입" : "로그인"}</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password (6자 이상 권장)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "처리 중..." : mode === "signup" ? "회원가입" : "로그인"}
        </button>
      </form>

      {msg && <p style={{ marginTop: "12px", color: "#b00020" }}>{msg}</p>}

      <div style={{ marginTop: "14px" }}>
        {mode === "signup" ? (
          <button type="button" onClick={() => setMode("signin")}>
            이미 계정이 있어요 → 로그인
          </button>
        ) : (
          <button type="button" onClick={() => setMode("signup")}>
            계정이 없어요 → 회원가입
          </button>
        )}
      </div>
    </div>
  );
}
