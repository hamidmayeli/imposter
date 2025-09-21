import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import NewGame from './pages/imposter/NewGame';
import Play from './pages/imposter/Play';
import HowToPlay from './pages/imposter/HowToPlay';
import { LanguageProvider } from './i18n/LanguageContext';
import { useT } from './i18n/texts';


const MenuBar: React.FC = () => {
  const t = useT();
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline">{t('selectGame')}</Link>
        <Link to="/how-to-play" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">{t('howToPlay')}</Link>
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
          <Route path="/imposter" element={<NewGame />} />
          <Route path="/imposter/play" element={<Play />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
