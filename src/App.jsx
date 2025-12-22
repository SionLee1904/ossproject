import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
      <header
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #ddd",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Yu-Gi-Oh! 카드 뷰어</h2>

        <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/">Home</Link>
          <Link to="/sample">Sample Deck</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/banlist">Banlist</Link>


          <span style={{ marginLeft: "12px", color: "#666" }}>
            {loadingAuth ? "auth..." : user ? `로그인: ${user.email}` : "로그인 안됨"}
          </span>

          {user ? (
            <button type="button" onClick={signOut}>
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      <main>
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
      </main>
    </BrowserRouter>
  );
}

export default App;
