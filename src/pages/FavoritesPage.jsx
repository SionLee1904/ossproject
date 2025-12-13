// src/pages/FavoritesPage.jsx
import { useState } from "react";
import CardList from "../components/CardList";
import CardDetailModal from "../components/CardDetailModal";
import useFavorites from "../hooks/useFavorites";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div style={{ padding: "0 16px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>즐겨찾기</h1>
      <p style={{ color: "#555" }}>
        총 {favorites.length}장 (카드를 클릭하면 상세보기, 별 버튼으로 해제)
      </p>

      <CardList cards={favorites} onCardClick={setSelectedCard} />


     <CardDetailModal
  card={selectedCard}
  onClose={() => setSelectedCard(null)}
  isFavorite={selectedCard ? favorites.some((c) => c.id === selectedCard.id) : false}
  onToggleFavorite={toggleFavorite}
/>

    </div>
  );
}
