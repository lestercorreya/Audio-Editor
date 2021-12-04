import HomeScreen from "./components/HomeScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Player from "./components/Player";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/play" element={<Player />} />
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
