import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import "../styles/Settings.css";
import FontContext from "../components/fontcontext";

function Settings() {
  const { font, setFont } = useContext(FontContext);
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    document.body.style.fontFamily = font;
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTaskCount(tasks.length);
  }, [font]);

  const handleFontChange = (e) => {
    const selectedFont = e.target.value;
    setFont(selectedFont);
    localStorage.setItem("font", selectedFont);
  };

  const handleReset = () => {
    if (window.confirm("정말 모든 기록을 초기화하시겠습니까?")) {
      localStorage.removeItem("tasks");
      alert("기록이 초기화되었습니다!");
      setTaskCount(0);
      window.location.reload();
    }
  };

  return (
    <div className="settings-container">
      <Navbar />
      <div className="settings-wrapper">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-group">
          <label>폰트 선택</label>
          <select value={font} onChange={handleFontChange}>
            <option value="sans-serif">기본 폰트</option>
            <option value="Arial">Arial</option>
            <option value="'Chakra Petch', sans-serif">Chakra Petch</option>
          </select>
        </div>

        <div className="settings-group">
          <label>현재 저장된 할 일 수</label>
          <p>{taskCount}개</p>
        </div>

        <div className="settings-group">
          <label>기록 초기화</label>
          <button className="danger" onClick={handleReset}>전체 초기화</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
