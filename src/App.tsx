import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewGame from './pages/NewGame';
import Play from './pages/Play';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewGame />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </Router>
  );
}

export default App;
