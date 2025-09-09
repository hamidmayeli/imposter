import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NewGame from './pages/NewGame';
import Play from './pages/Play';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { languages, useT } from './i18n/texts';


const MenuBar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const t = useT();
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-900 border-b dark:border-gray-800">
      <Link to="/" className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline">{t('newGame')}</Link>
      <div>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value as keyof typeof languages)}
          className="px-2 py-1 border rounded bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        >
          {Object.keys(languages).map(lang => (
            <option key={lang} value={lang}>{lang.toUpperCase()}</option>
          ))}
        </select>
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
          <Route path="/" element={<NewGame />} />
          <Route path="/play" element={<Play />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
