import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Today from "./pages/Today";
import History from "./pages/History";
import Important from "./pages/Important";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import FontContext from "./components/fontcontext";

function App() {
  const [font, setFont] = useState(localStorage.getItem("font") || "sans-serif");

  useEffect(() => {
    document.body.style.fontFamily = font;
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/today" element={<Today />} />
          <Route path="/history" element={<History />} />
          <Route path="/important" element={<Important />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </FontContext.Provider>
  );
}

export default App;
