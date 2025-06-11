import React, { useEffect, useState } from "react";
import "../styles/Stats.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaCheckCircle, FaChartPie } from "react-icons/fa";

function Stats() {
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [oldestTask, setOldestTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];

    setTotal(saved.length);
    setCompleted(saved.filter((task) => task.done).length);

    const incomplete = saved.filter((task) => !task.done);
    if (incomplete.length > 0) {
      const oldest = incomplete.reduce((a, b) => (a.id < b.id ? a : b));
      setOldestTask(oldest);
    }
  }, []);

  const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

  const goToTodayAndHighlight = () => {
    if (oldestTask) {
      localStorage.setItem("highlightTaskId", oldestTask.id);
      navigate("/today");
    }
  };

  return (
    <div className="stats-container">
      <Navbar />
      <div className="stats-wrapper">
        <h1 className="stats-title">Stats</h1>
        <div className="stats-grid">
          {/* 전체 할 일 카드 */}
          <div className="stats-card">
            <FaClipboardList className="stats-icon" />
            <div className="stats-label">전체 할 일</div>
            <div className="stats-value">{total}개</div>
            {oldestTask && (
              <div className="stats-sub-info clickable" onClick={goToTodayAndHighlight}>
                🕐 가장 오래된 할 일: <strong>{oldestTask.text}</strong>
              </div>
            )}
          </div>

          {/* 완료한 일 카드 */}
          <div className="stats-card">
            <FaCheckCircle className="stats-icon" />
            <div className="stats-label">완료한 일</div>
            <div className="stats-value">{completed}개</div>
          </div>

          {/* 완료율 카드 */}
          <div className="stats-card">
            <FaChartPie className="stats-icon" />
            <div className="stats-label">완료율</div>
            <div className="stats-value">{completionRate}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
