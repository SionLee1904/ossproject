// src/pages/SamplePage.jsx
import { useNavigate } from "react-router-dom";

export default function SamplePage() {
  const navigate = useNavigate();

  const sampleCards = [
    {
      name: "Sky Striker",
      imageUrl: "https://images.ygoprodeck.com/images/cards/26077387.jpg",
      internalPath: "/sample/sky-striker",
    },
    {
      name: "Altergeist",
      imageUrl: "https://images.ygoprodeck.com/images/cards/42790071.jpg",
      internalPath: "/sample/altergeist",
    },
    {
      name: "Gouki",
      imageUrl: "https://images.ygoprodeck.com/images/cards/24073068.jpg",
      internalPath: "/sample/gouki",
    },
  ];

  const handleImageClick = (path) => {
      if (path) {
        navigate(path); // React Router를 사용하여 내부 경로로 이동
      }
    };

  return (
    <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
      <h1>샘플 덱 페이지</h1>
      <p>아래 카드 이미지를 클릭하면 샘플 덱을 보여줍니다.</p>

      {/* Flexbox를 사용하여 이미지를 가로로 정렬하고 간격을 둡니다. */}
      <div style={{ 
          display: "flex", 
          justifyContent: "left", 
          gap: "24px", 
          marginTop: "20px",
          flexWrap: "wrap" 
      }}>
        {/* sampleCards 배열을 순회하며 각 카드를 렌더링합니다. */}
        {sampleCards.map((card) => (
          <div key={card.name} style={{ width: "300px" }}>
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name}
                onClick={() => handleImageClick(card.internalPath)}
                style={{
                  width: "200px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transition: "transform 0.2s",
                }}
              />
            ) : (
              <p>이미지를 불러올 수 없습니다.</p>
            )}

            {/* 카드 이름을 이미지 아래에 표시 */}
            <h3 style={{ marginTop: "10px", fontSize: "1.1em" }}>{card.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}