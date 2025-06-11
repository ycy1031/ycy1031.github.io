import React, { useState, useEffect } from "react";
import "../styles/Important.css";
import Navbar from "../components/Navbar";

function Important() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    const favorited = saved.filter((task) => task.favorite);
    setTasks(favorited);
  }, []);

  const toggleFavorite = (id) => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    const updated = saved.map((task) =>
      task.id === id ? { ...task, favorite: !task.favorite } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updated));
    setTasks(updated.filter((task) => task.favorite)); 
  };

  return (
    <div className="important-container">
      <Navbar />
      <div className="important-task-wrapper">
        <h1 className="important-page-title">Importants</h1>

        {tasks.length === 0 ? (
          <p className="important-empty">즐겨찾기한 항목이 없어요.</p>
        ) : (
          <div className="important-task-box">
            <ul className="important-task-list">
                {tasks.map((task) => (
                <li
                    key={task.id}
                    className={`important-task-item ${task.done ? "important-done" : ""}`}
                >
                    <input type="checkbox" checked={task.done} disabled readOnly />
                    <span className="important-task-text">{task.text}</span>
                    <button onClick={() => toggleFavorite(task.id)}>★</button>
                </li>
                ))}
            </ul>
          </div>

        )}
      </div>
    </div>
  );
}

export default Important;
