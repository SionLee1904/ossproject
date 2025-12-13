export default function CardDetailModal({
  card,
  onClose,
  isFavorite,
  onToggleFavorite,
}) {
  if (!card) return null;

  const imageUrl = card.card_images?.[0]?.image_url;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          maxWidth: "800px",
          width: "100%",
          display: "flex",
          gap: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={card.name}
            style={{ width: "250px", borderRadius: "8px" }}
          />
        )}

        <div style={{ flex: 1 }}>
          <h2>{card.name}</h2>
          <p>{card.type}</p>

          {/* 변경 전: 즐겨찾기 버튼이 여기 있었음 */}
          <button
            type="button"
            onClick={() => onToggleFavorite(card)}
            style={{ margin: "8px 0" }}
          >
            {isFavorite ? "★ 즐겨찾기 해제" : "☆ 즐겨찾기 추가"}
          </button>

          {card.atk !== undefined && (
            <p>
              ATK {card.atk} / DEF {card.def ?? "-"}
            </p>
          )}
          {card.level && <p>Level / Rank: {card.level}</p>}
          {card.attribute && <p>Attribute: {card.attribute}</p>}
          {card.race && <p>Race: {card.race}</p>}

          <hr />
          <p style={{ whiteSpace: "pre-wrap" }}>{card.desc}</p>

          <button type="button" onClick={onClose} style={{ marginTop: "16px" }}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
