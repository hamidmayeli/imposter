import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ImposterNewGame from './pages/imposter/NewGame';
import ImposterPlay from './pages/imposter/Play';
import HowToPlay from './pages/HowToPlay';
import { LanguageProvider } from './i18n/LanguageContext';
import { useT } from './i18n/texts';
import WordWhizNewGame from './pages/wordWhiz/NewGame';
import WordWhizPlay from './pages/wordWhiz/Play';


const MenuBar: React.FC = () => {
  const t = useT();
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline">{t('selectGame')}</Link>
      </div>
    </nav>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <MenuBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/imposter" element={<ImposterNewGame />} />
          <Route path="/imposter/play" element={<ImposterPlay />} />
          <Route path="/wordwhiz" element={<WordWhizNewGame />} />
          <Route path="/wordwhiz/play" element={<WordWhizPlay />} />
          <Route path="/how-to-play/:game" element={<HowToPlay />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
