// src/pages/deck/SkyStriker.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardDetailModal from "../../components/CardDetailModal";
import { fetchCardById } from "../../api/yugiohApi";
import useFavorites from "../../hooks/useFavorites";

const MAIN_DECK_CARDS = [
  { id: 26077387, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/26077387.jpg" }], quantity: 3 },
  { id: 37351133, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/37351133.jpg" }], quantity: 1 },
  { id: 23434538, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/23434538.jpg" }], quantity: 3 },
  { id: 14558127, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/14558127.jpg" }], quantity: 3 },
  { id: 97268402, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/97268402.jpg" }], quantity: 3 },
  { id: 50005218, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/50005218.jpg" }], quantity: 1 },
  { id: 24010609, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/24010609.jpg" }], quantity: 2 },
  { id: 97616504, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/97616504.jpg" }], quantity: 1 },
  { id: 63166095, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/63166095.jpg" }], quantity: 2 },
  { id: 51227866, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/51227866.jpg" }], quantity: 2 },
  { id: 98338152, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/98338152.jpg" }], quantity: 2 },
  { id: 25733157, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/25733157.jpg" }], quantity: 1 },
  { id: 52340444, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/52340444.jpg" }], quantity: 1 },
  { id: 99550630, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/99550630.jpg" }], quantity: 1 },
  { id: 25955749, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/25955749.jpg" }], quantity: 1 },
  { id: 32807846, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/32807846.jpg" }], quantity: 1 },
  { id: 73628505, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/73628505.jpg" }], quantity: 1 },
  { id: 76375976, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/76375976.jpg" }], quantity: 1 },
  { id: 70368879, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/70368879.jpg" }], quantity: 3 },
  { id: 67169062, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/67169062.jpg" }], quantity: 1 },
  { id: 24299458, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/24299458.jpg" }], quantity: 3 },
  { id: 89208725, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/89208725.jpg" }], quantity: 1 },
  { id: 10045474, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/10045474.jpg" }], quantity: 3 },
];

const EXTRA_DECK_CARDS = [
  { id: 90673288, card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/90673288.jpg" }], quantity: 1 },
];

function DeckCardItem({ card, onClick, isFav, onToggleFavorite }) {
  const imageUrl = card.card_images?.[0]?.image_url;
  const quantity = card.quantity || 1;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "4px",
        width: "110px",
        textAlign: "center",
        position: "relative",
        margin: 0,
      }}
    >
      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt={card.name}
            onClick={() => onClick(card)}
            style={{
              width: "100%",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "transform 0.1s",
            }}
          />

          {/* 수량 표시 */}
          {quantity > 1 && (
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "1em",
                fontWeight: "bold",
                zIndex: 10,
              }}
            >
              x{quantity}
            </div>
          )}

          {/* 즐겨찾기 토글 버튼 (좌측 상단) */}
          <button
            type="button"
            onClick={() => onToggleFavorite(card)}
            title={isFav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              border: "none",
              background: "rgba(255,255,255,0.9)",
              borderRadius: "6px",
              cursor: "pointer",
              padding: "2px 6px",
              zIndex: 10,
            }}
          >
            {isFav ? "★" : "☆"}
          </button>
        </>
      )}

      <h4 style={{ marginTop: "8px", fontSize: "14px" }}>{card.name}</h4>
      <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>{card.type}</p>
    </div>
  );
}

export default function SkyStrikerPage() {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();

  const handleGoBack = () => navigate("/sample");

  const handleCardClick = async (card) => {
    setLoadingDetail(true);
    setSelectedCard(null);
    try {
      const detail = await fetchCardById(card.id);
      setSelectedCard(detail);
    } catch (error) {
      console.error("Failed to fetch card detail:", error);
      alert("카드 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const renderCardList = (cards) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "20px" }}>
      {cards.map((card) => (
        <DeckCardItem
          key={card.id}
          card={card}
          onClick={handleCardClick}
          isFav={isFavorite(card.id)}           // ✅ card 객체 말고 id로!
          onToggleFavorite={toggleFavorite}     // ✅ 훅의 토글 사용
        />
      ))}
    </div>
  );

  const getMainDeckTotal = () => MAIN_DECK_CARDS.reduce((sum, c) => sum + (c.quantity || 1), 0);
  const getExtraDeckTotal = () => EXTRA_DECK_CARDS.reduce((sum, c) => sum + (c.quantity || 1), 0);

  return (
    <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2>Sky Striker 덱 소개</h2>
        <button
          onClick={handleGoBack}
          style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "#f9f9f9" }}
        >
          ↩ 뒤로가기
        </button>
      </div>

      <p>
        섬도희 덱은 몬스터 존을 비워 마법 카드의 추가 효과를 극대화하고, 링크 몬스터의 자원 순환 능력을 통해
        지속적인 견제와 아드 이득을 추구하는 미드레인지 운영 덱입니다. (이미지 클릭 시 세부 정보 표시)
      </p>

      <hr />

      <div style={{ marginTop: "20px" }}>
        <h3>메인 덱 ({getMainDeckTotal()}장)</h3>
        {renderCardList(MAIN_DECK_CARDS)}
      </div>

      <hr />

      <div style={{ marginTop: "20px" }}>
        <h3>엑스트라 덱 ({getExtraDeckTotal()}장)</h3>
        {renderCardList(EXTRA_DECK_CARDS)}
      </div>

      <hr />

      {loadingDetail && <p>상세 정보를 불러오는 중...</p>}

      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        isFavorite={selectedCard ? isFavorite(selectedCard.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
