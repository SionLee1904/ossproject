import { useEffect, useMemo, useState } from "react";
import {
  listFavorites,
  createFavorite,
  deleteFavorite,
  updateFavorite,
} from "../api/favoritesApi";

export default function useFavorites() {
  const userId = "sion"; // 과제면 고정값으로 둬도 OK (원하면 나중에 로그인처럼 확장)
  const [favorites, setFavorites] = useState([]);
  const [loadingFav, setLoadingFav] = useState(false);

  // cardId -> favorite(서버 레코드) 빠르게 찾기
  const byCardId = useMemo(() => {
    const m = new Map();
    favorites.forEach((f) => m.set(Number(f.cardId), f));
    return m;
  }, [favorites]);

  useEffect(() => {
    (async () => {
      setLoadingFav(true);
      try {
        const data = await listFavorites(userId); // READ
        setFavorites(data);
      } finally {
        setLoadingFav(false);
      }
    })();
  }, [userId]);

  // CREATE/DELETE 토글
  const toggleFavorite = async (card) => {
    const cardId = Number(card.id);
    const existing = byCardId.get(cardId);

    if (existing) {
      await deleteFavorite(existing.id); // DELETE
      setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
      return;
    }

    const payload = {
      userId,
      cardId: cardId,
      cardName: card.name,
      cardType: card.type,
      imageUrl: card.card_images?.[0]?.image_url ?? "",
      memo: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = await createFavorite(payload); // CREATE
    setFavorites((prev) => [created, ...prev]);
  };

  // UPDATE 예시(메모)
  const updateMemo = async (favoriteId, memo) => {
    const updated = await updateFavorite(favoriteId, {
      memo,
      updatedAt: new Date().toISOString(),
    });
    setFavorites((prev) => prev.map((f) => (f.id === favoriteId ? updated : f)));
  };

  const isFavorite = (cardId) => byCardId.has(Number(cardId));

  return { favorites, loadingFav, toggleFavorite, updateMemo, isFavorite };
}
