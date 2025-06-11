import { createContext } from "react";

const FontContext = createContext({
  font: "sans-serif",
  setFont: () => {},
});

export default FontContext;
