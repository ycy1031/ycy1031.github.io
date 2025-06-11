import React, { useState, useEffect } from "react";
import "../styles/Today.css";
import Navbar from "../components/Navbar";

function Today() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(saved);
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem("tasks", JSON.stringify(items));
  };

  const addTask = () => {
    if (input.trim()) {
      const newTask = {
        id: Date.now(),
        text: input,
        done: false,
        favorite: false,
        completedAt: null,
      };
      const updated = [...tasks, newTask];
      setTasks(updated);
      saveToLocalStorage(updated);
      setInput("");
    }
  };

  const toggleDone = (id) => {
    const updated = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            done: !task.done,
            completedAt: !task.done ? new Date().toISOString() : null,
          }
        : task
    );
    setTasks(updated);
    saveToLocalStorage(updated);
  };

  const toggleFavorite = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, favorite: !task.favorite } : task
    );
    setTasks(updated);
    saveToLocalStorage(updated);
  };

  return (
    <div className="today-container">
      <Navbar />

      <div className="today-task-wrapper">
        <h1 className="today-page-title">Today</h1>

        <div className="today-task-box">
          <div className="today-add-task">
            <input
              type="text"
              placeholder="오늘의 할 일을 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={addTask}>추가</button>
          </div>

          <ul className="today-task-list">
            {tasks.map((task) => (
              <li key={task.id} className={`today-task-item ${task.done ? "done" : ""}`}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                />
                <span className="today-task-text">{task.text}</span>
                <button onClick={() => toggleFavorite(task.id)}>
                  {task.favorite ? "★" : "☆"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Today;
