import { useEffect, useState } from "react";

const STORAGE_KEY = "yugioh_favorites";

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setFavorites(JSON.parse(raw));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = (card) => {
    setFavorites((prev) => {
      const exists = prev.some((c) => c.id === card.id);

      const next = exists
        ? prev.filter((c) => c.id !== card.id)
        : [...prev, card];

     
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { favorites, toggleFavorite };
}
