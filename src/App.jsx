// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      {/* 공통 네비게이션 바 */}
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
        <nav style={{ display: "flex", gap: "12px" }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          {/* 나중에 <Link to="/deck">Deck Builder</Link> 이런 식으로 추가 가능 */}
        </nav>
      </header>

      {/* 실제 페이지가 바뀌는 영역 */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* 나중 라우트 추가 예시 */}
          {/* <Route path="/deck" element={<DeckBuilderPage />} /> */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
