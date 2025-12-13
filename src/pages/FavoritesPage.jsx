// src/pages/FavoritesPage.jsx
import { useState } from "react";
import CardList from "../components/CardList";
import CardDetailModal from "../components/CardDetailModal";
import useFavorites from "../hooks/useFavorites";
import { fetchCardById } from "../api/yugiohApi";

export default function FavoritesPage() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [selectedCard, setSelectedCard] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ✅ 즐겨찾기 목록 클릭 → cardId로 상세 fetch 후 모달 오픈
  const handleCardClick = async (favRecord) => {
    const cardId = Number(favRecord.cardId ?? favRecord.id); // 안전장치
    setLoadingDetail(true);
    try {
      const detail = await fetchCardById(cardId);
      setSelectedCard(detail);
    } catch (e) {
      console.error(e);
      alert("카드 상세 정보를 불러오지 못했습니다.");
    } finally {
      setLoadingDetail(false);
    }
  };

  // ✅ CardList가 기대하는 형태(card.id, card.name, card.card_images...)로 변환
  const cardsForList = favorites.map((f) => ({
    id: Number(f.cardId), // CardItem key/클릭 기준 id
    name: f.cardName ?? "(이름 없음)",
    type: f.cardType ?? "",
    card_images: f.imageUrl ? [{ image_url: f.imageUrl }] : [],
    __fav: f, // 클릭 시 원본 레코드를 넘기기 위한 백업
  }));

  return (
    <div style={{ padding: "0 16px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>즐겨찾기</h1>
      <p style={{ color: "#555" }}>
        총 {favorites.length}장 (카드를 클릭하면 상세보기)
      </p>

      {loadingDetail && <p>상세 정보를 불러오는 중...</p>}

      {/* ✅ 클릭하면 원본 favRecord로 상세 fetch */}
      <CardList
        cards={cardsForList}
        onCardClick={(card) => handleCardClick(card.__fav)}
      />

      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        isFavorite={selectedCard ? isFavorite(selectedCard.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
