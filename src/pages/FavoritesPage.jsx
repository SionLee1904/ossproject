import { useEffect, useMemo, useState } from "react";
import CardList from "../components/CardList";
import CardDetailModal from "../components/CardDetailModal";
import useFavorites from "../hooks/useFavorites";
import { fetchCardById } from "../api/yugiohApi";

export default function FavoritesPage() {
  const { favorites, toggleFavorite, isFavorite, updateMemo, loadingFav } = useFavorites();

  const [selectedCard, setSelectedCard] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [memoDraft, setMemoDraft] = useState("");
  const [savingMemo, setSavingMemo] = useState(false);

  const selectedFavRecord = useMemo(() => {
    if (!selectedCard) return null;
    return favorites.find((f) => Number(f.card_id) === Number(selectedCard.id)) ?? null;
  }, [favorites, selectedCard]);

  useEffect(() => {
    setMemoDraft(selectedFavRecord?.memo ?? "");
  }, [selectedFavRecord]);

  const handleCardClick = async (favRecord) => {
    const cardId = Number(favRecord.card_id);
    setLoadingDetail(true);
    try {
      const detail = await fetchCardById(cardId);
      setSelectedCard(detail);
    } catch (e) {
      console.error(e);
      alert("카드 상세 정보를 불러오지 못했습니다.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const cardsForList = useMemo(() => {
    return favorites.map((f) => ({
      id: Number(f.card_id),
      name: f.card_name ?? "(이름 없음)",
      type: f.card_type ?? "",
      card_images: f.image_url ? [{ image_url: f.image_url }] : [],
      memo: f.memo ?? "",
      __fav: f,
    }));
  }, [favorites]);

  const handleSaveMemo = async () => {
    if (!selectedFavRecord) return;
    setSavingMemo(true);
    try {
      await updateMemo(selectedFavRecord.id, memoDraft);
    } catch (e) {
      console.error(e);
      alert("메모 저장에 실패했습니다.");
    } finally {
      setSavingMemo(false);
    }
  };

  const handleToggleFavoriteFromModal = async (card) => {
    try {
      await toggleFavorite(card);
    } catch (e) {
      console.error(e);
      alert("즐겨찾기 처리에 실패했습니다. (로그인이 필요할 수 있어요)");
    }
  };

  return (
    <div style={{ padding: "0 16px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>즐겨찾기</h1>
      <p style={{ color: "#555" }}>
        총 {favorites.length}장
        {loadingFav ? " (불러오는 중...)" : ""}
      </p>

      {loadingDetail && <p>상세 정보를 불러오는 중...</p>}

      <CardList
        cards={cardsForList}
        onCardClick={(card) => handleCardClick(card.__fav)}
      />

      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        isFavorite={selectedCard ? isFavorite(selectedCard.id) : false}
        onToggleFavorite={handleToggleFavoriteFromModal}
        showMemoEditor={!!selectedFavRecord}
        memoValue={memoDraft}
        onMemoChange={setMemoDraft}
        onMemoSave={handleSaveMemo}
        savingMemo={savingMemo}
      />
    </div>
  );
}
