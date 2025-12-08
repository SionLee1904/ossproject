// src/pages/AboutPage.jsx

export default function AboutPage() {
  return (
    <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>About</h1>
      <p>
        이 사이트는 React와 YGOPRODeck API를 사용하여
        유희왕 카드 정보를 검색하고 살펴볼 수 있도록 만든 개인 프로젝트입니다.
      </p>
      <p>
        기능:
      </p>
      <ul>
        <li>카드 이름/타입으로 검색</li>
        <li>카드 이미지, 효과, 스탯 보기</li>
        <li>즐겨찾기 기능(브라우저 LocalStorage 저장)</li>
      </ul>
      <p>
        앞으로 덱 빌더, 금제 리스트 보기, 아키타입별 필터 등 다양한 기능을 추가할 수 있습니다.
      </p>
    </div>
  );
}
