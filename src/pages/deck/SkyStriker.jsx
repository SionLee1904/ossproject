// src/pages/deck/SkyStriker.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardDetailModal from "../../components/CardDetailModal";
import { fetchCardById } from "../../api/yugiohApi";

const MAIN_DECK_CARDS = [
    { 
      id: 26077387, 
      card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/26077387.jpg" }],
      quantity: 3 
    },
    { 
      id: 63166095, 
      card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/63166095.jpg" }],
      quantity: 2
    },
];

const EXTRA_DECK_CARDS = [
    { 
      id: 90673288, 
      card_images: [{ image_url: "https://images.ygoprodeck.com/images/cards/90673288.jpg" }],
      quantity: 1 
    },
];

const DeckCardItem = ({ card, onClick, isFavorite, onToggleFavorite }) => {
    const imageUrl = card.card_images?.[0]?.image_url;
    const quantity = card.quantity || 1;

    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "4px",
                width: "100px",
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
                            transition: "transform 0.1s"
                        }}
                    />
                    
                    {/*  수량 표시 레이블 (우측 상단으로 복구) */}
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
                </>
            )}
            {/*  텍스트 스타일 */}
            <h4 style={{ marginTop: "8px", fontSize: "14px" }}>{card.name}</h4>
            <p style={{ fontSize: "12px", color: "#555" }}>{card.type}</p>
        </div>
    );
}

export default function SkyStrikerPage() {
    const navigate = useNavigate();
    const [selectedCard, setSelectedCard] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState([]); 

    const handleGoBack = () => { navigate('/sample'); };
    const onToggleFavorite = (card) => {
        const cardId = card.id;
        setFavoriteIds(prevIds => {
            if (prevIds.includes(cardId)) {
                return prevIds.filter(id => id !== cardId);
            } else {
                return [...prevIds, cardId];
            }
        });
    };
    const isFavorite = (card) => { return favoriteIds.includes(card.id); };

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
                    isFavorite={isFavorite(card)} 
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    );

    const getMainDeckTotal = () => MAIN_DECK_CARDS.reduce((sum, card) => sum + (card.quantity || 1), 0);
    const getExtraDeckTotal = () => EXTRA_DECK_CARDS.reduce((sum, card) => sum + (card.quantity || 1), 0);


    return (
        <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '16px'
            }}>
                <h2> Sky Striker 덱 소개</h2>
                <button onClick={handleGoBack} style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
                    ↩ 뒤로가기
                </button>
            </div>

            <p>섬도희 덱은 몬스터 존을 비워 마법 카드의 추가 효과를 극대화하고, 링크 몬스터의 자원 순환 능력을 통해 지속적인 견제와 아드 이득을 추구하는 미드레인지 운영 덱입니다(이미지 클릭시, 세부 정보 표시)</p>
            
            <hr />

            {/* 메인 덱 섹션 */}
            <div style={{ marginTop: "20px" }}>
                <h3>메인 덱 ({getMainDeckTotal()}장)</h3>
                {renderCardList(MAIN_DECK_CARDS)}
            </div>

            <hr />

            {/* 엑스트라 덱 섹션 */}
            <div style={{ marginTop: "20px" }}>
                <h3>엑스트라 덱 ({getExtraDeckTotal()}장)</h3>
                {renderCardList(EXTRA_DECK_CARDS)}
            </div>
            
            <hr />

            {loadingDetail && <p>상세 정보를 불러오는 중...</p>}

            <CardDetailModal
                card={selectedCard}
                onClose={() => setSelectedCard(null)}
            />
        </div>
    );
}