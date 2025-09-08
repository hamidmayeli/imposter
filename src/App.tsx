import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewPage from './pages/NewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
