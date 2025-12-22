// src/pages/BanlistPage.jsx
import { useEffect, useMemo, useState } from "react";
import CardList from "../components/CardList";
import CardDetailModal from "../components/CardDetailModal";
import { fetchBanlistCards } from "../api/yugiohApi";

export default function BanlistPage() {
  const [format, setFormat] = useState("TCG"); // "TCG" | "OCG"
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchBanlistCards(format);
        if (!mounted) return;
        setCards(data);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setError("금제 리스트를 불러오지 못했습니다.");
        setCards([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [format]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter((c) => (c.name ?? "").toLowerCase().includes(q));
  }, [cards, query]);

  const groups = useMemo(() => {
    const key = format === "TCG" ? "ban_tcg" : "ban_ocg";
    const getStatus = (c) => c?.banlist_info?.[key] ?? "";

    const forbidden = [];
    const limited = [];
    const semi = [];

    for (const c of filtered) {
      const s = getStatus(c);
      if (s === "Banned") forbidden.push(c);
      else if (s === "Limited") limited.push(c);
      else if (s === "Semi-Limited") semi.push(c);
    }

    const byName = (a, b) => (a.name ?? "").localeCompare(b.name ?? "");
    forbidden.sort(byName);
    limited.sort(byName);
    semi.sort(byName);

    return { forbidden, limited, semi };
  }, [filtered, format]);

  return (
    <div style={{ padding: "0 16px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>금제 리스트</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ color: "#555" }}>형식:</span>
          <button
            type="button"
            onClick={() => setFormat("TCG")}
            style={{
              padding: "6px 10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              background: format === "TCG" ? "#eee" : "white",
              cursor: "pointer",
            }}
          >
            TCG
          </button>
          <button
            type="button"
            onClick={() => setFormat("OCG")}
            style={{
              padding: "6px 10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              background: format === "OCG" ? "#eee" : "white",
              cursor: "pointer",
            }}
          >
            OCG
          </button>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="카드명 검색 (영문)"
          style={{
            flex: "1 1 260px",
            padding: "8px 10px",
            border: "1px solid #ccc",
            borderRadius: "10px",
          }}
        />

        <div style={{ color: "#555" }}>
          <span style={{ marginRight: 10 }}>🔴 금지</span>
          <span style={{ marginRight: 10 }}>🟡 제한</span>
          <span>🟢 준제한</span>
        </div>
      </div>

      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <Section title={`🔴 Forbidden (금지) — ${groups.forbidden.length}장`}>
            <CardList cards={groups.forbidden} onCardClick={setSelectedCard} banFormat={format} />
          </Section>

          <Section title={`🟡 Limited (제한) — ${groups.limited.length}장`}>
            <CardList cards={groups.limited} onCardClick={setSelectedCard} banFormat={format} />
          </Section>

          <Section title={`🟢 Semi-Limited (준제한) — ${groups.semi.length}장`}>
            <CardList cards={groups.semi} onCardClick={setSelectedCard} banFormat={format} />
          </Section>
        </>
      )}

      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        banFormat={format}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 18 }}>
      <h2 style={{ margin: "10px 0" }}>{title}</h2>
      {children}
    </div>
  );
}
