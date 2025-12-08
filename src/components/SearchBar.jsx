import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ name, type });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      <input
        type="text"
        placeholder="카드 이름(영문) ex) Dark Magician"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All Types</option>
        <option value="Effect Monster">Effect Monster</option>
        <option value="Normal Monster">Normal Monster</option>
        <option value="Spell Card">Spell</option>
        <option value="Trap Card">Trap</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
}
