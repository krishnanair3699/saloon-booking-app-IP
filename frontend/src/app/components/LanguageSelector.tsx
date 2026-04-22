import { useLanguage, Language } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
  ];

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
      <Globe className="w-4 h-4 text-blue-600" />
      <div className="flex gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              language === lang.code
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-blue-50'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
