
import React from 'react';
import type { ScanRecord, ScanStatus } from '../types';
import CameraIcon from './icons/CameraIcon';
import HomeIcon from './icons/HomeIcon';
import MailIcon from './icons/MailIcon';
import StarIcon from './icons/StarIcon';
import AddToHomeScreenPrompt from './AddToHomeScreenPrompt';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

interface HomeScreenProps {
  scanHistory: ScanRecord[];
  onNewScan: () => void;
  onLogout: () => void;
  onViewRecord: (id: string) => void;
  onHome: () => void;
  onContact: () => void;
  onRate: () => void;
}

const getOverallStatus = (record: ScanRecord): ScanStatus => {
    if (record.scans.some(s => s.status === "Don't Buy")) return "Don't Buy";
    if (record.scans.some(s => s.status === "Warning")) return "Warning";
    return "Good";
}

const statusColors: Record<ScanStatus, string> = {
    "Good": "border-green-500",
    "Warning": "border-yellow-500",
    "Don't Buy": "border-red-500"
}


const HomeScreen: React.FC<HomeScreenProps> = ({ scanHistory, onNewScan, onLogout, onViewRecord, onHome, onContact, onRate }) => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const getTranslatedStatus = (status: ScanStatus) => {
    const key = `scan.${status.toLowerCase().replace("'", "")}`;
    return t(key);
  };

  return (
    <div className="min-h-screen bg-base-200 animate-fade-in">
      <header className="bg-base-100 shadow-md p-4 flex justify-between items-center">
        <button onClick={onHome} className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity">
          <HomeIcon className="w-8 h-8 text-brand-orange" />
          <div>
            <h1 className="text-xl font-bold">{t('home.title')}</h1>
            <p className="text-xs text-base-content/60 -mt-1">{t('home.dashboard')}</p>
          </div>
        </button>
        <div className="flex items-center gap-4">
            <button onClick={toggleLanguage} className="text-sm font-semibold text-base-content/80 hover:text-brand-orange w-10 h-8 rounded-full border border-base-300 flex items-center justify-center">
              {language.toUpperCase()}
            </button>
            <button onClick={onLogout} className="text-sm font-semibold text-brand-orange hover:underline">{t('home.logout')}</button>
        </div>
      </header>

      <main className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
            <div 
              onClick={onNewScan}
              className="bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-brand-orange group"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 bg-brand-orange/10 p-4 rounded-full">
                    <CameraIcon className="w-12 h-12 text-brand-orange" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-center md:text-left">{t('home.newScanTitle')}</h2>
                  <p className="mt-1 text-base-content/70 text-center md:text-left">{t('home.newScanDesc')}</p>
                </div>
                <div className="md:ml-auto">
                  <button className="w-full md:w-auto px-8 py-3 bg-brand-orange text-white font-bold rounded-xl text-lg hover:bg-brand-orange/90 transition-transform active:scale-95 group-hover:scale-105">
                    {t('home.startNowButton')}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 px-2">{t('home.historyTitle')}</h3>
              {scanHistory.length === 0 ? (
                <div className="bg-base-100 rounded-2xl p-8 text-center text-base-content/60 border-2 border-dashed border-base-300">
                  <h4 className="text-lg font-semibold">{t('home.noScansTitle')}</h4>
                  <p>{t('home.noScansDesc')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scanHistory.map(record => {
                    const overallStatus = getOverallStatus(record);
                    return (
                      <div 
                        key={record.id} 
                        onClick={() => onViewRecord(record.id)}
                        className={`bg-base-100 p-4 rounded-xl shadow flex justify-between items-center cursor-pointer hover:bg-base-300 transition-colors border-l-4 ${statusColors[overallStatus]}`}
                      >
                        <div>
                          <p className="font-bold">{record.title}</p>
                          <p className="text-sm text-base-content/70">{record.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-sm px-3 py-1 rounded-full ${ { "Good": "bg-green-500/10 text-green-400", "Warning": "bg-yellow-500/10 text-yellow-400", "Don't Buy": "bg-red-500/10 text-red-400" }[overallStatus] }`}>{getTranslatedStatus(overallStatus)}</p>
                          <p className="text-sm text-base-content/70 mt-1">{record.scans.length} {t('home.scans')}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Action Grid - Moved below history */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={onContact}
                className="bg-base-100 p-4 rounded-xl shadow hover:shadow-md hover:bg-base-50 transition-all flex flex-col items-center justify-center gap-2 text-center"
              >
                <div className="p-2 bg-brand-blue/10 rounded-full">
                  <MailIcon className="w-6 h-6 text-brand-blue" />
                </div>
                <span className="font-semibold text-sm">{t('home.contactSupport')}</span>
              </button>
              
              <button 
                onClick={onRate}
                className="bg-base-100 p-4 rounded-xl shadow hover:shadow-md hover:bg-base-50 transition-all flex flex-col items-center justify-center gap-2 text-center"
              >
                <div className="p-2 bg-brand-yellow/10 rounded-full">
                  <StarIcon className="w-6 h-6 text-brand-yellow" filled />
                </div>
                <span className="font-semibold text-sm">{t('home.rateApp')}</span>
              </button>
            </div>

        </div>
      </main>
      <AddToHomeScreenPrompt />
    </div>
  );
};

export default HomeScreen;
