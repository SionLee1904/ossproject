// src/pages/HomePage.jsx
import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import CardList from "../components/CardList";
import CardDetailModal from "../components/CardDetailModal";
import { fetchCards } from "../api/yugiohApi";
import useFavorites from "../hooks/useFavorites";

export default function HomePage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortKey, setSortKey] = useState("name_asc");

  const [memoDraft, setMemoDraft] = useState("");
  const [savingMemo, setSavingMemo] = useState(false);
  const [history, setHistory] = useState([]);

  const { favorites, toggleFavorite, isFavorite, updateMemo } = useFavorites();

  // ✅ favorites에서 카드별 memo 매핑
  const memoMap = useMemo(() => {
    const m = new Map();
    favorites.forEach((f) => {
      const cid = Number(f.card_id ?? f.cardId);
      if (!Number.isNaN(cid)) m.set(cid, f.memo ?? "");
    });
    return m;
  }, [favorites]);

  // ✅ 검색 카드들에 memo 붙이기 (리스트에서 표시용)
  const cardsWithMemo = useMemo(() => {
    return cards.map((c) => ({
      ...c,
      memo: memoMap.get(Number(c.id)) ?? "",
    }));
  }, [cards, memoMap]);

  // ✅ 선택 카드와 매칭되는 favorites 레코드 찾기
  const selectedFavRecord = useMemo(() => {
    if (!selectedCard) return null;
    return (
      favorites.find(
        (f) => Number(f.card_id ?? f.cardId) === Number(selectedCard.id)
      ) ?? null
    );
  }, [favorites, selectedCard]);

  useEffect(() => {
    setMemoDraft(selectedFavRecord?.memo ?? "");
  }, [selectedFavRecord]);

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

  // ✅ 정렬 (memo 붙은 카드 기준으로 정렬/표시)
  const sortedCards = useMemo(() => {
    const arr = [...cardsWithMemo];
    const num = (v) => (typeof v === "number" ? v : Number(v ?? 0)) || 0;

    switch (sortKey) {
      case "name_asc":
        arr.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
        break;
      case "name_desc":
        arr.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
        break;
      case "atk_desc":
        arr.sort((a, b) => num(b.atk) - num(a.atk));
        break;
      case "atk_asc":
        arr.sort((a, b) => num(a.atk) - num(b.atk));
        break;
      case "level_desc":
        arr.sort((a, b) => num(b.level) - num(a.level));
        break;
      case "level_asc":
        arr.sort((a, b) => num(a.level) - num(b.level));
        break;
      case "type_asc":
        arr.sort((a, b) => (a.type ?? "").localeCompare(b.type ?? ""));
        break;
      default:
        break;
    }
    return arr;
  }, [cardsWithMemo, sortKey]); // ✅ 여기 꼭 cardsWithMemo로!

 const handleSearch = async (payload) => {
    setHasSearched(true);
    setLoading(true);
    setError("");

    // 검색기록: 이름이 있는 경우만 저장 (중복 제거, 최신이 앞으로)
    const term = (payload?.name ?? "").trim();
    if (term) {
      setHistory((prev) => {
        const next = [term, ...prev.filter((x) => x !== term)];
        return next.slice(0, 8); // 최대 8개
      });
    }

    try {
      const result = await fetchCards( payload );
      setCards(result);
    } catch (err) {
      console.error(err);
      setError("검색 중 오류가 발생했습니다.");
      setCards([]);
    } finally {
      setLoading(false);
    }
  };
  const clearHistory = () => setHistory([]);
  const handleToggleFavoriteFromModal = async (card) => {
    try {
      await toggleFavorite(card);
    } catch (e) {
      console.error(e);
      alert("즐겨찾기 처리에 실패했습니다.");
    }
  };


return (
    
    <div style={{ padding: "0 16px", maxWidth: "1200px", margin: "0 auto" }}>
     <SearchBar onSearch={handleSearch} history={history} onClearHistory={clearHistory} />

      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ color: "#555" }}>정렬:</span>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="name_asc">이름 (A→Z)</option>
          <option value="name_desc">이름 (Z→A)</option>
          <option value="atk_desc">ATK (높은→낮은)</option>
          <option value="atk_asc">ATK (낮은→높은)</option>
          <option value="level_desc">레벨 (높은→낮은)</option>
          <option value="level_asc">레벨 (낮은→높은)</option>
          <option value="type_asc">타입 (A→Z)</option>
        </select>
      </div>

      {!hasSearched && (
        <div style={{ padding: "16px", maxWidth: "800px" }}>
          <h1 style={{ marginTop: 0 }}>About</h1>
          <p>
            이 사이트는 React와 YGOPRODeck API를 사용하여 유희왕 카드 정보를 검색하고 살펴볼 수 있도록 만든 프로젝트입니다.
          </p>
          <p>기능:</p>
          <ul>
            <li>카드 이름/타입으로 검색</li>
            <li>카드 이미지, 효과, 스탯 보기</li>
            <li>즐겨찾기 + 메모 기능 (사용자별 저장)</li>
          </ul>
        </div>
      )}

      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

     
      <CardList cards={sortedCards} onCardClick={setSelectedCard} />

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

