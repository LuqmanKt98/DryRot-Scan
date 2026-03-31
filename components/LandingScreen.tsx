import React from 'react';
import LogoIcon from './icons/LogoIcon';
import SparklesIcon from './icons/SparklesIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import CpuChipIcon from './icons/CpuChipIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

interface LandingScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigateToLogin, onNavigateToSignUp }) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };
  
  const tireBgUrl = 'https://picsum.photos/seed/tire/1920/1080';

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col p-6 text-center animate-fade-in"
      style={{ 
        backgroundImage: `
          radial-gradient(circle, rgba(13, 27, 42, 0.5) 0%, rgba(27, 38, 59, 0.9) 70%),
          url(${tireBgUrl})
        `
      }}
    >
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {!process.env.VITE_STRIPE_PUBLISHABLE_KEY && (
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-stripe-setup'))}
              className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg animate-pulse"
            >
              SETUP STRIPE
            </button>
          )}
          <button 
            onClick={toggleLanguage} 
            className="text-sm font-semibold text-white hover:bg-brand-orange/90 bg-brand-orange w-12 h-10 rounded-full flex items-center justify-center transition-colors"
          >
            {language.toUpperCase()}
          </button>
        </div>

        <div className="relative z-10 max-w-2xl w-full mx-auto flex-grow flex flex-col justify-center">
          <div className="pt-8">
            <LogoIcon className="w-24 h-24 mx-auto" />
            <h1 className="text-4xl font-extrabold mt-4">{t('landing.title')}</h1>
            <p className="mt-2 text-lg text-base-content/80">{t('landing.subtitle')}</p>
          </div>

          <div className="space-y-4 my-8">
            <div className="w-full p-4 bg-brand-orange text-base-100 rounded-xl text-left flex items-center gap-4">
              <SparklesIcon className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">{t('landing.feature1Title')}</h3>
                <p className="text-base-100/80 text-sm">{t('landing.feature1Desc')}</p>
              </div>
            </div>
            <div className="w-full p-4 bg-brand-orange text-base-100 rounded-xl text-left flex items-center gap-4">
              <ShieldCheckIcon className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">{t('landing.feature2Title')}</h3>
                <p className="text-base-100/80 text-sm">{t('landing.feature2Desc')}</p>
              </div>
            </div>
            <div className="w-full p-4 bg-brand-orange text-base-100 rounded-xl text-left flex items-center gap-4">
              <CpuChipIcon className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">{t('landing.feature3Title')}</h3>
                <p className="text-base-100/80 text-sm">{t('landing.feature3Desc')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pb-4">
            <button 
              onClick={onNavigateToSignUp}
              className="w-full py-4 bg-brand-orange text-white font-bold rounded-xl text-lg hover:bg-brand-orange/90 transition-transform active:scale-95"
            >
              {t('landing.startScanButton')}
            </button>
            <button 
              onClick={onNavigateToLogin}
              className="w-full py-4 bg-brand-orange text-white font-bold rounded-xl text-lg hover:bg-brand-orange/90 transition-transform active:scale-95"
            >
              {t('landing.signInButton')}
            </button>
          </div>
        </div>
    </div>
  );
};

export default LandingScreen;
