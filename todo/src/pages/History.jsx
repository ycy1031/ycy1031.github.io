import React, { useEffect, useState } from "react";
import "../styles/History.css";
import Navbar from "../components/Navbar";

function History() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const recentCompleted = saved.filter(
      (task) =>
        task.done &&
        new Date(task.completedAt).getTime() >= sevenDaysAgo.getTime()
    );

    setTasks(recentCompleted);
  }, []);

  return (
    <div className="history-container">
      <Navbar />
      <div className="history-task-wrapper">
        <h1 className="history-page-title">History</h1>
        {tasks.length === 0 ? (
          <p className="history-empty">최근 완료한 할 일이 없어요.</p>
        ) : (
          <ul className="history-task-list">
            {tasks.map((task) => (
              <li key={task.id} className="history-task-item">
                <div className="history-task-main">{task.text}</div>
                <div className="history-task-sub">
                  완료일: {new Date(task.completedAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default History;
