import React from 'react';
import type { TirePosition, TireSide } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import CheckIcon from './icons/CheckIcon';
import { useTranslation } from '../hooks/useTranslation';

interface TireDetailScreenProps {
  position: TirePosition;
  scannedSides: TireSide[];
  onSelectSide: (side: TireSide) => void;
  onBack: () => void;
}

const TireDetailScreen: React.FC<TireDetailScreenProps> = ({ position, scannedSides, onSelectSide, onBack }) => {
  const { t } = useTranslation();
  const sides: TireSide[] = ['Right Sidewall', 'Left Sidewall', 'Inside'];

  const isSideScanned = (side: TireSide) => scannedSides.includes(side);
  
  const positionKeyMap = {
    'Front Left': 'tirePositions.frontLeft',
    'Front Right': 'tirePositions.frontRight',
    'Rear Left': 'tirePositions.rearLeft',
    'Rear Right': 'tirePositions.rearRight',
    'General': 'tirePositions.general'
  };

  const sideKeyMap = {
    'Right Sidewall': 'tireDetail.rightSidewall',
    'Left Sidewall': 'tireDetail.leftSidewall',
    'Inside': 'tireDetail.inside',
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
       <header className="bg-base-100 shadow-md p-4 flex justify-between items-center">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-base-300">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{t(positionKeyMap[position])}</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-4 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center mb-2">{t('tireDetail.title')}</h2>
        <p className="text-center mb-8 text-base-content/80 max-w-md">{t('tireDetail.description')}</p>
        
        <div className="w-full max-w-md md:max-w-lg space-y-4">
          {sides.map(side => (
            <button 
              key={side}
              onClick={() => onSelectSide(side)}
              className={`w-full p-6 bg-base-100 rounded-xl shadow-md text-left flex items-center justify-between transition-all duration-200 ${
                isSideScanned(side) ? 'border-l-4 border-green-500' : 'hover:bg-base-200 hover:scale-105'
              }`}
            >
              <span className="text-lg font-semibold">{t(sideKeyMap[side])}</span>
              {isSideScanned(side) && <CheckIcon className="w-6 h-6 text-green-500" />}
            </button>
          ))}
        </div>
      </main>
       <footer className="p-4 mt-auto">
        <button onClick={onBack} className="w-full py-3 bg-base-300 text-base-content font-bold rounded-xl text-lg hover:bg-base-200 transition-transform active:scale-95">
          {t('tireDetail.backToVehicleButton')}
        </button>
      </footer>
    </div>
  );
};

export default TireDetailScreen;