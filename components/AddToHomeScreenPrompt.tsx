import React, { useState, useEffect } from 'react';
import ShareIcon from './icons/ShareIcon';
import PlusSquareIcon from './icons/PlusSquareIcon';
import XIcon from './icons/XIcon';
import { useTranslation } from '../hooks/useTranslation';

const AddToHomeScreenPrompt: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Basic check for iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // Check if the app is running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // Check if the user has dismissed the prompt before
    const hasSeenPrompt = localStorage.getItem('hasSeenAddToHomeScreenPrompt');

    if (isIOS && !isStandalone && !hasSeenPrompt) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('hasSeenAddToHomeScreenPrompt', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in-up">
      <div className="bg-base-300 p-4 rounded-xl shadow-2xl flex items-start gap-4 border border-base-100">
        <div className="flex-grow">
          <h4 className="font-bold text-base-content">{t('addToHome.title')}</h4>
          <p className="text-sm text-base-content/80 mt-1">
            {t('addToHome.description')}
            <ShareIcon className="w-4 h-4 inline-block mx-1" />
            {t('addToHome.instruction')}
            <PlusSquareIcon className="w-4 h-4 inline-block mx-1" />
            {t('addToHome.instructionAction')}
          </p>
        </div>
        <button onClick={handleDismiss} className="p-1 text-base-content/60 hover:text-base-content">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AddToHomeScreenPrompt;