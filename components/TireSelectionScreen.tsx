import React from 'react';
import type { ScanResult, TirePosition } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import CheckIcon from './icons/CheckIcon';
import { useTranslation } from '../hooks/useTranslation';

interface TireSelectionScreenProps {
  scans: ScanResult[];
  onSelectPosition: (position: TirePosition) => void;
  onBack: () => void;
  onFinish: () => void;
}

const TireButton: React.FC<{ 
  position: TirePosition, 
  onClick: () => void,
  scans: ScanResult[],
  className?: string,
}> = ({ position, onClick, scans, className }) => {
  const { t } = useTranslation();
  const scansForPosition = scans.filter(s => s.tirePosition === position);
  const scannedSidesCount = new Set(scansForPosition.map(s => s.tireSide)).size;

  let statusClass = 'bg-base-100 border-base-300 hover:bg-base-200 hover:border-brand-orange';
  if (scannedSidesCount > 0 && scannedSidesCount < 3) {
      statusClass = 'bg-yellow-500/10 border-yellow-500 text-yellow-200';
  } else if (scannedSidesCount >= 3) {
      statusClass = 'bg-green-500/10 border-green-500 text-green-200';
  }

  const positionKeyMap = {
    'Front Left': 'tirePositions.frontLeft',
    'Front Right': 'tirePositions.frontRight',
    'Rear Left': 'tirePositions.rearLeft',
    'Rear Right': 'tirePositions.rearRight',
    'General': 'tirePositions.general'
  };

  const translatedPosition = t(positionKeyMap[position]);

  return (
    <button 
      onClick={onClick}
      className={`relative w-24 h-36 md:w-28 md:h-40 rounded-lg border-2 flex flex-col items-center justify-center text-center font-semibold transition-all duration-200 ${statusClass} ${className}`}
    >
      <span className="whitespace-pre-line text-base">{translatedPosition.replace(' ', '\n')}</span>
      {scannedSidesCount > 0 && (
          <span className="text-xs mt-1 opacity-80">{t('vehicleStatus.scanned', { count: scannedSidesCount })}</span>
      )}
      {scannedSidesCount >= 3 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
            <CheckIcon className="w-4 h-4 text-green-500" />
        </div>
      )}
    </button>
  );
};


const TireSelectionScreen: React.FC<TireSelectionScreenProps> = ({ scans, onSelectPosition, onBack, onFinish }) => {
  const { t } = useTranslation();
  const handleSelect = (position: TirePosition) => {
    onSelectPosition(position);
  };

  const canFinish = scans.length > 0;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
       <header className="bg-base-100 shadow-md p-4 flex justify-between items-center">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-base-300">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{t('vehicleStatus.title')}</h1>
        <div className="w-10"></div>
      </header>
      
      <main className="flex-grow p-4 flex flex-col items-center">
        <p className="text-center mb-6 text-base-content/80 max-w-lg">{t('vehicleStatus.description')}</p>
        
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-[3/4] flex items-center justify-center mb-8">
            <div className="absolute top-0 left-0">
                <TireButton position="Front Left" onClick={() => handleSelect('Front Left')} scans={scans} />
            </div>
            <div className="absolute top-0 right-0">
                <TireButton position="Front Right" onClick={() => handleSelect('Front Right')} scans={scans} />
            </div>

            <div className="w-40 h-64 md:w-48 md:h-72 bg-base-300/50 rounded-2xl flex items-center justify-center text-base-content/50 font-bold border-2 border-base-300">
                {t('vehicleStatus.carBody')}
            </div>

            <div className="absolute bottom-0 left-0">
                <TireButton position="Rear Left" onClick={() => handleSelect('Rear Left')} scans={scans} />
            </div>
            <div className="absolute bottom-0 right-0">
                <TireButton position="Rear Right" onClick={() => handleSelect('Rear Right')} scans={scans} />
            </div>
        </div>
        
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
            <TireButton position="General" onClick={() => handleSelect('General')} scans={scans} className="w-full h-24 flex-row gap-4" />
            <p className="text-xs text-center mt-2 text-base-content/60">{t('vehicleStatus.generalTireDesc')}</p>
        </div>

      </main>

      <footer className="p-4 bg-base-100 shadow-lg mt-auto space-y-3">
        <button
          onClick={onFinish}
          disabled={!canFinish}
          className="w-full py-4 bg-brand-orange text-white font-bold rounded-xl text-lg hover:bg-brand-orange/90 transition-transform active:scale-95 disabled:bg-base-300 disabled:cursor-not-allowed"
        >
          {t('vehicleStatus.finishButton')}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 bg-base-300 text-base-content font-bold rounded-xl text-lg hover:bg-base-200 transition-transform active:scale-95"
        >
          {t('vehicleStatus.cancelAndHome')}
        </button>
      </footer>
    </div>
  );
};

export default TireSelectionScreen;