import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Teams from "./pages/teams";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/teams" element={<Teams />} />
    </Routes>
  );
}

export default App;
