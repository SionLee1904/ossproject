export default function CardItem({ card, onClick, isFavorite, onToggleFavorite }) {
  const imageUrl = card.card_images?.[0]?.image_url;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "8px",
        cursor: "pointer",
        width: "180px",
      }}
      onClick={() => onClick(card)}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={card.name}
          style={{ width: "100%", borderRadius: "4px" }}
        />
      )}
      <h4 style={{ marginTop: "8px", fontSize: "14px" }}>{card.name}</h4>
      <p style={{ fontSize: "12px", color: "#555" }}>{card.type}</p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(card);
        }}
      >
        {isFavorite ? "★ 즐겨찾기 해제" : "☆ 즐겨찾기"}
      </button>
    </div>
  );
}
