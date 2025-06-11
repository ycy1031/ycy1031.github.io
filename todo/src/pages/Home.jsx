// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const summaries = {
  today: "오늘의 할 일을 적어보세요.",
  history: "최근 완료한 작업을 확인해요.",
  important: "중요한 할 일만 모아봤어요.",
  stats: "할 일 통계를 한눈에 확인!",
  settings: "테마나 폰트를 설정해요.",
};

function Home() {
  return (
    <div className="home-container">
      <header className="header">
        <h1>My-ToDo</h1>
      </header>

      <div className="card-area">
        <div className="card-row">
          <Card to="/today" emoji="📝" title="Today" desc={summaries.today} />
          <Card to="/history" emoji="📜" title="History" desc={summaries.history} />
          <Card to="/important" emoji="⭐" title="Importants" desc={summaries.important} />
        </div>
        <div className="card-row">
          <Card to="/stats" emoji="📊" title="Stats" desc={summaries.stats} />
          <Card to="/settings" emoji="⚙️" title="Settings" desc={summaries.settings} />
        </div>
      </div>
    </div>
  );
}

function Card({ to, emoji, title, desc }) {
  return (
    <Link to={to} className="card">
      <div className="card-emoji">{emoji}</div>
      <div className="card-title">{title}</div>
      <div className="card-desc">{desc}</div>
    </Link>
  );
}

export default Home;
