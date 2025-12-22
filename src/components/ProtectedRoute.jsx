import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) return <p style={{ padding: "0 16px" }}>로그인 상태 확인 중...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
