import { useEffect, useMemo, useState } from "react";
import useAuth from "./useAuth";
import {
  listFavorites,
  createFavorite,
  deleteFavorite,
  updateFavorite,
} from "../api/favoritesApi";

export default function useFavorites() {
  const { user, loadingAuth } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [loadingFav, setLoadingFav] = useState(false);

  // card_id -> favorite record (빠른 조회)
  const byCardId = useMemo(() => {
    const m = new Map();
    favorites.forEach((f) => m.set(Number(f.card_id), f));
    return m;
  }, [favorites]);

  // 로그인 상태가 확정되면 favorites 로드
  useEffect(() => {
    if (loadingAuth) return;
    if (!user) {
      setFavorites([]);
      return;
    }

    (async () => {
      setLoadingFav(true);
      try {
        const data = await listFavorites(user.id);
        setFavorites(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingFav(false);
      }
    })();
  }, [user, loadingAuth]);

  const isFavorite = (cardId) => byCardId.has(Number(cardId));

  // CREATE/DELETE 토글
  const toggleFavorite = async (card) => {
    if (!user) throw new Error("Not authenticated");

    const cardId = Number(card.id);
    const existing = byCardId.get(cardId);

    // 이미 즐겨찾기면 삭제
    if (existing) {
      await deleteFavorite(existing.id);
      setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
      return;
    }

    // 새로 추가
    const payload = {
      user_id: user.id,
      card_id: cardId,
      card_name: card.name ?? "",
      card_type: card.type ?? "",
      image_url: card.card_images?.[0]?.image_url ?? "",
      memo: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const created = await createFavorite(payload);
    setFavorites((prev) => [created, ...prev]);
  };

  // UPDATE: memo
  const updateMemo = async (favoriteId, memo) => {
    const updated = await updateFavorite(favoriteId, {
      memo,
      updated_at: new Date().toISOString(),
    });
    setFavorites((prev) => prev.map((f) => (f.id === favoriteId ? updated : f)));
  };

  return { favorites, loadingFav, toggleFavorite, updateMemo, isFavorite };
}
