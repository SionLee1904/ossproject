// src/pages/HomePage.jsx
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import CardList from "../components/CardList";
import CardDetailModal from "../components/CardDetailModal";
import { fetchCards } from "../api/yugiohApi";
import useFavorites from "../hooks/useFavorites";

export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); //

  const { favorites, toggleFavorite } = useFavorites();

  const handleSearch = async ({ name, type }) => {
    setHasSearched(true); //
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
      <SearchBar onSearch={handleSearch} />
      {/* ✅ 검색 전에는 About 내용을 안내로 보여줌 */}
      {!hasSearched && (
        <div style={{ padding: "16px", maxWidth: "800px" }}>
          <h1 style={{ marginTop: 0 }}>About</h1>
          <p>
            이 사이트는 React와 YGOPRODeck API를 사용하여 유희왕 카드 정보를 검색하고
            살펴볼 수 있도록 만든 개인 프로젝트입니다.
          </p>
          <p>기능:</p>
          <ul>
            <li>카드 이름/타입으로 검색</li>
            <li>카드 이미지, 효과, 스탯 보기</li>
            <li>즐겨찾기 기능(브라우저 LocalStorage 저장)</li>
          </ul>
          <p>
            앞으로 덱 빌더, 금제 리스트 보기, 아키타입별 필터 등 다양한 기능을 추가할 수 있습니다.
          </p>
        </div>
      )}
      
      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <CardList cards={cards} onCardClick={setSelectedCard} />


     <CardDetailModal
  card={selectedCard}
  onClose={() => setSelectedCard(null)}
  isFavorite={selectedCard ? favorites.some((c) => c.id === selectedCard.id) : false}
  onToggleFavorite={toggleFavorite}
/>

    </div>
  );
}
