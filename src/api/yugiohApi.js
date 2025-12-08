const BASE_URL = "https://db.ygoprodeck.com/api/v7";

export async function fetchCards({ name, type }) {
  const params = new URLSearchParams();

  if (name) {
    // 부분 일치 검색
    params.append("fname", name);
  }
  if (type) {
    params.append("type", type);
  }

  const url = `${BASE_URL}/cardinfo.php?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("카드 정보를 불러오는데 실패했습니다.");
  }
  const data = await res.json();
  return data.data; // 카드 배열
}

export async function fetchCardById(id) {
  const url = `${BASE_URL}/cardinfo.php?id=${id}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("카드 정보를 불러오는데 실패했습니다.");
  }
  const data = await res.json();
  return data.data[0];
}
