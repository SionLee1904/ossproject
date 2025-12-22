// src/components/CardList.jsx
import CardItem from "./CardItem";

export default function CardList({ cards = [], onCardClick }) {
  if (!cards?.length) return <p className="empty">검색 결과가 없습니다.</p>;

  return (
    <div className="grid">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} onClick={() => onCardClick?.(card)} />
      ))}
    </div>
  );
}
