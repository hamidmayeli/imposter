import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ImposterNewGame from './pages/imposter/NewGame';
import ImposterPlay from './pages/imposter/Play';
import HowToPlay from './pages/HowToPlay';
import { LanguageProvider } from './i18n/LanguageContext';
import { useT } from './i18n/texts';
import ConnectNewGame from './pages/connect/NewGame';
import ConnectPlay from './pages/connect/Play';


const MenuBar: React.FC = () => {
  const t = useT();
  return (
    <nav className="sticky bottom-0 md:top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b md:border-b border-t md:border-t-0 border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="p-4 group flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-300 dark:hover:to-purple-300 transition-all">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t('selectGame')}
          </Link>
        </div>
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
          <Route path="/connect" element={<ConnectNewGame />} />
          <Route path="/connect/play" element={<ConnectPlay />} />
          <Route path="/how-to-play/:game" element={<HowToPlay />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
