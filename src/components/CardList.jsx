// src/components/CardList.jsx
import CardItem from "./CardItem";

export default function CardList({ cards = [], onCardClick, favorites, onToggleFavorite, banFormat }) {
  if (!cards?.length) return <p>검색 결과가 없습니다.</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
        gap: "12px",
      }}
    >
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onClick={() => onCardClick?.(card)}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          banFormat={banFormat}
        />
      ))}
    </div>
  );
}
