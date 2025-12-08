// src/pages/HomePage.jsx
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import CardList from "../components/CardList";
import CardDetailModal from "../components/CardDetailModal";
import FavoritesPanel from "../components/FavoritesPanel";
import { fetchCards } from "../api/yugiohApi";
import useFavorites from "../hooks/useFavorites";

export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  const { favorites, toggleFavorite } = useFavorites();

  const handleSearch = async ({ name, type }) => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchCards({ name, type });
      setCards(result);
    } catch (err) {
      console.error(err);
      setError("검색 중 오류가 발생했습니다.");
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "0 16px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* 제목은 App.jsx 헤더에서 이미 보여주니까 여기선 생략 가능 */}
      <SearchBar onSearch={handleSearch} />

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        <div style={{ flex: 3 }}>
          {loading && <p>불러오는 중...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <CardList
            cards={cards}
            onCardClick={setSelectedCard}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </div>

        <div style={{ flex: 1 }}>
          <FavoritesPanel
            favorites={favorites}
            onCardClick={setSelectedCard}
          />
        </div>
      </div>

      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
}
