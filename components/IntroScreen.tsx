import React, { useState } from 'react';
import CameraIcon from './icons/CameraIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import HandIcon from './icons/HandIcon';
import HomeIcon from './icons/HomeIcon';
import { useTranslation } from '../hooks/useTranslation';

interface IntroScreenProps {
  onComplete: () => void;
  onHome: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete, onHome }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <CameraIcon className="w-16 h-16 text-brand-orange" />,
      title: t('intro.step1Title'),
      description: t('intro.step1Desc'),
    },
    {
      icon: <LightbulbIcon className="w-16 h-16 text-brand-yellow" />,
      title: t('intro.step2Title'),
      description: t('intro.step2Desc'),
    },
    {
      icon: <HandIcon className="w-16 h-16 text-brand-blue" />,
      title: t('intro.step3Title'),
      description: t('intro.step3Desc'),
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col justify-between p-6 text-center animate-fade-in">
       <header className="absolute top-4 left-4">
        <button onClick={onHome} className="p-2 rounded-full hover:bg-base-200">
          <HomeIcon className="w-6 h-6" />
        </button>
      </header>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="mb-8">{currentStep.icon}</div>
        <h1 className="text-3xl font-bold mb-4">{currentStep.title}</h1>
        <p className="text-lg text-base-content/80 max-w-sm">{currentStep.description}</p>
      </div>

      <div className="pb-4">
        <div className="flex justify-center space-x-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === step ? 'bg-brand-orange w-6' : 'bg-base-300'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="w-full py-4 bg-brand-orange text-white font-bold rounded-xl text-lg hover:bg-brand-orange/90 transition-transform active:scale-95"
        >
          {step === steps.length - 1 ? t('intro.getStartedButton') : t('intro.nextButton')}
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;