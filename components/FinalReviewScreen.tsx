import React from 'react';
import type { ScanRecord, ScanResult, ScanStatus, TirePosition } from '../types';
import HomeIcon from './icons/HomeIcon';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import { useTranslation } from '../hooks/useTranslation';

interface FinalReviewScreenProps {
  record: ScanRecord;
  onAccept: () => void;
  onGoBack: () => void;
}

const statusStyles: Record<ScanStatus, { bg: string, text: string, icon: React.ReactNode }> = {
  "Good": { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckIcon className="w-5 h-5" /> },
  "Warning": { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <span className="font-bold text-lg">!</span> },
  "Don't Buy": { bg: 'bg-red-100', text: 'text-red-800', icon: <XIcon className="w-5 h-5" /> },
};

const AgeIndicator: React.FC<{age: number}> = ({ age }) => {
    const { t } = useTranslation();
    let riskKey = 'result.lowRisk';
    let colorClasses = 'bg-green-500/10 text-green-400';
    if (age >= 6 && age < 10) {
        riskKey = 'result.mediumRisk';
        colorClasses = 'bg-yellow-500/10 text-yellow-400';
    } else if (age >= 10) {
        riskKey = 'result.highRisk';
        colorClasses = 'bg-red-500/10 text-red-400';
    }
    return <span className={`px-2 py-1 text-xs font-bold rounded ${colorClasses}`}>{t(riskKey)}</span>;
};


const FinalReviewScreen: React.FC<FinalReviewScreenProps> = ({ record, onAccept, onGoBack }) => {
  const { t } = useTranslation();
    
  const overallStatus = (): ScanStatus => {
    if (record.scans.some(s => s.status === "Don't Buy")) return "Don't Buy";
    if (record.scans.some(s => s.status === "Warning")) return "Warning";
    return "Good";
  }
  
  const getTranslatedStatus = (status: ScanStatus) => {
    const key = `scan.${status.toLowerCase().replace(/['\s]/g, "")}`;
    return t(key);
  };

  const overallStatusValue = overallStatus();
  const summaryStyle = statusStyles[overallStatusValue];

  const groupedScans = record.scans.reduce((acc, scan) => {
    (acc[scan.tirePosition] = acc[scan.tirePosition] || []).push(scan);
    return acc;
  }, {} as Record<TirePosition, ScanResult[]>);

  const tireOrder: TirePosition[] = ['Front Left', 'Front Right', 'Rear Left', 'Rear Right', 'General'];
  
  return (
    <div className="min-h-screen bg-base-200">
      <header className="bg-base-100 shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <button onClick={onGoBack} className="p-2 rounded-full hover:bg-base-300">
          <HomeIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{t('finalReview.title')}</h1>
        <div className="w-10"></div>
      </header>
      
      <main className="p-4">
        <div className="max-w-4xl mx-auto space-y-6 pb-40">
          <div className={`p-6 rounded-2xl shadow-lg ${summaryStyle.bg} ${summaryStyle.text}`}>
              <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center">{summaryStyle.icon}</div>
                  <h2 className="text-2xl font-bold">{t('result.overallStatus')}: {getTranslatedStatus(overallStatusValue)}</h2>
              </div>
              <p className="mt-2 text-sm">{t('finalReview.description')}</p>
          </div>

          {tireOrder.map(position => 
              groupedScans[position] && <TireReportCard key={position} position={position} scans={groupedScans[position]} />
          )}
        </div>
      </main>

      <footer className="p-4 bg-base-100 shadow-lg fixed bottom-0 z-10 w-full space-y-3 border-t border-base-300">
         <button
          onClick={onAccept}
          className="w-full py-4 bg-brand-orange text-white font-bold rounded-xl text-lg hover:bg-brand-orange/90 transition-transform active:scale-95"
        >
          {t('finalReview.acceptButton')}
        </button>
        <button
          onClick={onGoBack}
          className="w-full py-3 bg-base-300 text-base-content font-bold rounded-xl text-lg hover:bg-base-200 transition-transform active:scale-95"
        >
          {t('finalReview.goBackButton')}
        </button>
      </footer>
    </div>
  );
};

const TireReportCard: React.FC<{position: TirePosition, scans: ScanResult[]}> = ({ position, scans }) => {
    const { t } = useTranslation();
    const tireDotInfo = scans.find(s => s.dotInfo)?.dotInfo;
    const overallTireStatus = scans.reduce((worst, current) => {
        if (current.status === "Don't Buy") return "Don't Buy";
        if (current.status === "Warning" && worst !== "Don't Buy") return "Warning";
        return worst;
    }, "Good" as ScanStatus);
    const style = statusStyles[overallTireStatus];

    const getTranslatedStatus = (status: ScanStatus) => {
      const key = `scan.${status.toLowerCase().replace(/['\s]/g, "")}`;
      return t(key);
    };

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
        <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden">
            <div className={`p-4 ${style.bg} ${style.text} flex justify-between items-center`}>
                <h3 className="font-bold text-lg">{t(positionKeyMap[position])}</h3>
                 <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 text-sm font-semibold">
                    {style.icon}
                    <span>{getTranslatedStatus(overallTireStatus)}</span>
                </div>
            </div>
            <div className="p-4 space-y-4">
                {tireDotInfo && (
                    <div className="p-3 bg-base-200 rounded-lg">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold">{t('result.dotInfoTitle', { age: tireDotInfo.age })}</h4>
                            <AgeIndicator age={tireDotInfo.age} />
                        </div>
                        <p className="text-sm text-base-content/70 mt-1">
                            <strong>{t('result.code')}:</strong> {tireDotInfo.code} | <strong>{t('result.manufactured')}:</strong> Wk {tireDotInfo.week}, {tireDotInfo.year}
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    {scans.map((scan, index) => (
                        <div key={index} className="border-t border-base-300 pt-4">
                            <h5 className="font-semibold text-base-content/90">{t('result.analysisFor')}: {t(sideKeyMap[scan.tireSide])}</h5>
                            <img src={scan.image} alt={`Scan of ${scan.tireSide}`} className="mt-2 w-full h-40 object-cover rounded-lg" />
                            {scan.analysis.map((item, i) => (
                                <div key={i} className="mt-2">
                                    <p className="font-semibold text-sm">{item.title}</p>
                                    <p className="text-sm text-base-content/80">{item.details}</p>

                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FinalReviewScreen;