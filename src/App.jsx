// src/App.jsx
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SamplePage from "./pages/SamplePage";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./hooks/useAuth";
import BanlistPage from "./pages/BanlistPage";

import SkyStriker from "./pages/deck/SkyStriker";
import Altergeist from "./pages/deck/Altergeist";

function App() {
  const { user, signOut, loadingAuth } = useAuth();

  return (
    <BrowserRouter>
      <div className="app">
        {/* ✅ 헤더 */}
        <header className="site-header">
          <div className="container header-inner">
            <Link to="/" className="brand">
              <div className="brand-mark" aria-hidden="true" />
              <div className="brand-text">
                <div className="brand-title">Yu-Gi-Oh! 카드 뷰어</div>
                <div className="brand-sub">Search · Favorites · Memo</div>
              </div>
            </Link>

            <nav className="nav">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Home
              </NavLink>
              <NavLink to="/sample" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Sample Deck
              </NavLink>
              <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Favorites
              </NavLink>
              <NavLink to="/banlist" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Banlist
              </NavLink>
            </nav>

            <div className="auth">
              <div className="auth-status">
                {loadingAuth ? (
                  <span className="muted">auth...</span>
                ) : user ? (
                  <span className="muted">로그인: {user.email}</span>
                ) : (
                  <span className="muted">로그인 안됨</span>
                )}
              </div>

              {user ? (
                <button type="button" className="btn btn-ghost" onClick={signOut}>
                  Logout
                </button>
              ) : (
                <Link className="btn btn-primary" to="/login">
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* ✅ 메인 */}
        <main className="site-main">
          <div className="container page">
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/sample" element={<SamplePage />} />
              <Route path="/sample/sky-striker" element={<SkyStriker />} />
              <Route path="/sample/altergeist" element={<Altergeist />} />

              <Route path="/banlist" element={<BanlistPage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>

        {/* ✅ 푸터 */}
        <footer className="site-footer">
          <div className="container footer-inner">
            <span className="muted">© {new Date().getFullYear()} Yu-Gi-Oh Viewer</span>
            <span className="muted">Built with React · Supabase</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
