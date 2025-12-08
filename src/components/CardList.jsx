import CardItem from "./CardItem";

export default function CardList({ cards, onCardClick, favorites, onToggleFavorite }) {
  const favoriteIds = new Set(favorites.map((c) => c.id));

  if (!cards || cards.length === 0) {
    return <p>검색 결과가 없습니다.</p>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onClick={onCardClick}
          isFavorite={favoriteIds.has(card.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
