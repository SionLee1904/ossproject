// src/api/yugiohApi.js
const BASE = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

async function handle(res) {
  if (!res.ok) {
    const text = await res.text();
    console.error("[YGOPRODeck] API error:", res.status, res.statusText, text);
    throw new Error("API request failed");
  }
  const json = await res.json();
  return json?.data ?? [];
}

export async function fetchCards({ name, type } = {}) {
  const params = new URLSearchParams();
  if (name && name.trim()) params.set("fname", name.trim());
  if (type && type.trim() && type !== "All") params.set("type", type.trim());

  const url = `${BASE}?${params.toString()}`;
  const res = await fetch(url);
  return await handle(res);
}

export async function fetchCardById(cardId) {
  const params = new URLSearchParams();
  params.set("id", String(cardId));
  const url = `${BASE}?${params.toString()}`;
  const res = await fetch(url);
  const data = await handle(res);
  return data[0] ?? null;
}

/**
 * 금제 리스트: format = "TCG" | "OCG"
 * - banlist 파라미터로 금제 대상 카드만 가져오고
 * - 각 카드의 banlist_info.ban_tcg / ban_ocg 상태를 사용
 */
export async function fetchBanlistCards(format = "TCG") {
  const params = new URLSearchParams();
  params.set("banlist", format);   // 문서에 있는 파라미터 :contentReference[oaicite:1]{index=1}
  const url = `${BASE}?${params.toString()}`;

  const res = await fetch(url);
  return await handle(res);
}
