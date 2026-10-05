import { useState } from "react";
import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
  const [nivel, setNivel] = useState<string | null>(null);

  if (!nivel) {
    return <Home setNivel={setNivel} />;
  }

  return <Game nivel={nivel} setNivel={setNivel} />;
}

export default App;