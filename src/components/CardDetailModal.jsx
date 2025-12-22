
// src/components/CardDetailModal.jsx
function getBanStatus(card, banFormat) {
  const info = card?.banlist_info;
  if (!info || !banFormat) return null;

  const key = banFormat === "OCG" ? "ban_ocg" : "ban_tcg";
  const status = info[key];
  if (!status) return null;

  if (status === "Banned") return { label: "금지", emoji: "🔴" };
  if (status === "Limited") return { label: "제한", emoji: "🟡" };
  if (status === "Semi-Limited") return { label: "준제한", emoji: "🟢" };
  return null;
}

function tcgPlayerUrl(name) {
  return `https://www.tcgplayer.com/search/yugioh/product?productLineName=yugioh&q=${encodeURIComponent(
    name || ""
  )}`;
}

function surugaYaUrl(name) {
  return `https://www.suruga-ya.com/en/products?keyword=${encodeURIComponent(name || "")}&btn_search=`;
}

export default function CardDetailModal({
  card,
  onClose,

  isFavorite,
  onToggleFavorite,

  memoValue,
  onMemoChange,
  onMemoSave,
  savingMemo = false,
  showMemoEditor = false,

  banFormat,
}) {
  if (!card) return null;

  const image = card?.card_images?.[0]?.image_url;
  const ban = getBanStatus(card, banFormat);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(900px, 100%)",
          background: "white",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid #ddd",
          color: "#111", // ✅ 핵심: 흰 배경에서 글자가 항상 보이도록
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr" }}>
          <div style={{ borderRight: "1px solid #eee", background: "#fafafa" }}>
            {image ? (
              <img src={image} alt={card?.name} style={{ width: "100%", display: "block" }} />
            ) : (
              <div style={{ height: 320, display: "grid", placeItems: "center", color: "#666" }}>
                (이미지 없음)
              </div>
            )}
          </div>

          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, color: "#111" }}>{card?.name}</h2>

              {ban && (
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid #ddd",
                    fontSize: 13,
                    background: "white",
                    color: "#111",
                  }}
                  title={`${banFormat} ${ban.label}`}
                >
                  {ban.emoji} {banFormat} {ban.label}
                </span>
              )}
            </div>

            <div style={{ color: "#444", marginTop: 6 }}>{card?.type}</div>

            <div style={{ marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.5, color: "#111" }}>
              {card?.desc}
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {typeof onToggleFavorite === "function" && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(card)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                    color: "#111",
                  }}
                >
                  {isFavorite ? "★ 즐겨찾기 해제" : "☆ 즐겨찾기 추가"}
                </button>
              )}

              <a
                href={tcgPlayerUrl(card?.name)}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  textDecoration: "none",
                  color: "#111",
                  background: "white",
                }}
              >
                TCGPlayer로 구매
              </a>

              <a
                href={surugaYaUrl(card?.name)}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  textDecoration: "none",
                  color: "#111",
                  background: "white",
                }}
              >
                일본(Suruga-ya) 구매
              </a>
            </div>

            {showMemoEditor && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 6, color: "#111" }}>메모</div>
                <textarea
                  value={memoValue ?? ""}
                  onChange={(e) => onMemoChange?.(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    background: "#fff",
                    color: "#111",          // ✅ 메모 글자 검정
                    caretColor: "#111",     // ✅ 커서도 검정
                  }}
                  placeholder="이 카드에 대한 메모를 적어보세요"
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={onMemoSave}
                    disabled={savingMemo}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      background: "white",
                      cursor: "pointer",
                      color: "#111",
                    }}
                  >
                    {savingMemo ? "저장 중..." : "메모 저장"}
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                marginTop: 14,
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
                color: "#111",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
