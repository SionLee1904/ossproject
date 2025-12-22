import { useState } from "react";

/** 스타일(렌더마다 재생성 방지) */
const selectStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  flex: 1,
  minWidth: "140px",
  background: "white",
};

const inputStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const primaryBtn = {
  padding: "10px 24px",
  cursor: "pointer",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "6px",
};

const grayBtn = {
  padding: "10px 16px",
  cursor: "pointer",
  background: "#f0f0f0",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const chipStyle = {
  padding: "4px 12px",
  borderRadius: "16px",
  border: "1px solid #eee",
  background: "#f5f5f5",
  fontSize: "12px",
  cursor: "pointer",
};

/** 옵션(확장 쉬움) */
const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "Effect Monster", label: "Effect Monster" },
  { value: "Normal Monster", label: "Normal Monster" },
  { value: "Spell Card", label: "Spell Card" },
  { value: "Trap Card", label: "Trap Card" },
];

const ATTRIBUTE_OPTIONS = [
  { value: "", label: "All Attributes" },
  { value: "LIGHT", label: "LIGHT" },
  { value: "DARK", label: "DARK" },
  { value: "WATER", label: "WATER" },
  { value: "FIRE", label: "FIRE" },
  { value: "EARTH", label: "EARTH" },
  { value: "WIND", label: "WIND" },
];

export default function SearchBar({ onSearch, history = [], onClearHistory }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [attribute, setAttribute] = useState("");
  const [level, setLevel] = useState(""); // string으로 유지 (select 값)

  const buildPayload = (override = {}) => {
    const cleanName = (override.name ?? name).trim();

    return {
      name: cleanName,
      type: override.type ?? type,
      attribute: override.attribute ?? attribute,
      level: override.level ?? level,
    };
  };

  const isEmptyPayload = (p) =>
    !p.name && !p.type && !p.attribute && !p.level;

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = buildPayload();
    if (isEmptyPayload(payload)) return; // ✅ 완전 빈 검색 방지

    onSearch(payload);
  };

  const handleReset = () => {
    setName("");
    setType("");
    setAttribute("");
    setLevel("");
  };

  const handleClickHistory = (term) => {
    const payload = buildPayload({ name: term });

    setName(term);               // ✅ 입력칸도 업데이트
    if (!isEmptyPayload(payload)) onSearch(payload); // ✅ 즉시 검색
  };

  const showHistory = Array.isArray(history) && history.length > 0;

  return (
    <div style={{ marginBottom: "24px" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* 상단: 검색어 + 버튼 */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="카드 이름(영문) ex) Dark Magician"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={primaryBtn}>
            Search
          </button>
          <button type="button" onClick={handleReset} style={grayBtn}>
            Reset
          </button>
        </div>

        {/* 하단: 필터들 */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select value={attribute} onChange={(e) => setAttribute(e.target.value)} style={selectStyle}>
            {ATTRIBUTE_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select value={level} onChange={(e) => setLevel(e.target.value)} style={selectStyle}>
            <option value="">All Levels/Ranks</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* 최근 검색어 */}
      {showHistory && (
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#777" }}>최근 검색:</span>

          {history.map((term, index) => (
            <button
              key={`${term}-${index}`}
              type="button"
              onClick={() => handleClickHistory(term)}
              style={chipStyle}
              title="클릭하면 바로 검색"
            >
              {term}
            </button>
          ))}

          {typeof onClearHistory === "function" && (
            <button
              type="button"
              onClick={onClearHistory}
              style={{ border: "none", background: "none", color: "#ff4d4f", fontSize: "12px", cursor: "pointer" }}
            >
              기록 삭제
            </button>
          )}
        </div>
      )}
    </div>
  );
}
