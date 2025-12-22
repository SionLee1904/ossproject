// src/components/SearchBar.jsx
import { useState } from "react";

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
  const [level, setLevel] = useState("");

  const buildPayload = (override = {}) => {
    const cleanName = (override.name ?? name).trim();
    return {
      name: cleanName,
      type: override.type ?? type,
      attribute: override.attribute ?? attribute,
      level: override.level ?? level,
    };
  };

  const isEmpty = (p) => !p.name && !p.type && !p.attribute && !p.level;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = buildPayload();
    if (isEmpty(payload)) return;
    onSearch(payload);
  };

  const handleReset = () => {
    setName("");
    setType("");
    setAttribute("");
    setLevel("");
  };

  const handleClickHistory = (term) => {
    setName(term);
    const payload = buildPayload({ name: term });
    if (!isEmpty(payload)) onSearch(payload);
  };

  const showHistory = Array.isArray(history) && history.length > 0;

  return (
    <div className="search">
      <form onSubmit={handleSubmit} className="search__form">
        <div className="search__row">
          <input
            className="search__input"
            type="text"
            placeholder="카드 이름(영문) ex) Dark Magician"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn btn--primary" type="submit">Search</button>
          <button className="btn" type="button" onClick={handleReset}>Reset</button>
        </div>

        <div className="search__row search__filters">
          <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select className="select" value={attribute} onChange={(e) => setAttribute(e.target.value)}>
            {ATTRIBUTE_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">All Levels/Ranks</option>
            {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </form>

      {showHistory && (
        <div className="history">
          <span className="history__label">최근 검색:</span>
          {history.map((term, idx) => (
            <button
              key={`${term}-${idx}`}
              type="button"
              className="chip"
              onClick={() => handleClickHistory(term)}
              title="클릭하면 바로 검색"
            >
              {term}
            </button>
          ))}
          {typeof onClearHistory === "function" && (
            <button type="button" className="linkDanger" onClick={onClearHistory}>
              기록 삭제
            </button>
          )}
        </div>
      )}
    </div>
  );
}
