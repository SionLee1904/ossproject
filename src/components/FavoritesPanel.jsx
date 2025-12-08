export default function FavoritesPanel({ favorites, onCardClick }) {
  if (favorites.length === 0) {
    return <p>즐겨찾기한 카드가 없습니다.</p>;
  }

  return (
    <div>
      <h3>★ 즐겨찾기</h3>
      <ul>
        {favorites.map((card) => (
          <li
            key={card.id}
            style={{ cursor: "pointer" }}
            onClick={() => onCardClick(card)}
          >
            {card.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
