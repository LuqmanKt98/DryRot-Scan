
import React, { useState, useEffect } from 'react';
import LandingScreen from './components/LandingScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import IntroScreen from './components/IntroScreen';
import HomeScreen from './components/HomeScreen';
import VehicleStatusScreen from './components/TireSelectionScreen';
import TireDetailScreen from './components/TireDetailScreen';
import ScanScreen from './components/ScanScreen';
import CodeReaderScreen from './components/CodeReaderScreen';
import ResultScreen from './components/ResultScreen';
import PaymentScreen from './components/PaymentScreen';
import FinalReviewScreen from './components/FinalReviewScreen';
import ChatScreen from './components/ChatScreen';
import ContactScreen from './components/ContactScreen';
import AppReviewScreen from './components/AppReviewScreen';
import Toast from './components/Toast';
import AddToHomeScreenPrompt from './components/AddToHomeScreenPrompt';
import ConfigHelper from './components/ConfigHelper';
import { useTranslation } from './hooks/useTranslation';
import type { ScanResult, ScanRecord, DOTInfo, TirePosition, TireSide, ToastMessage, ChatMessage } from './types';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

type Screen = 
  | 'landing' 
  | 'login' 
  | 'signup'
  | 'intro' 
  | 'home' 
  | 'vehicle-status'
  | 'tire-detail'
  | 'payment'
  | 'scan' 
  | 'code-reader'
  | 'result'
  | 'final-review'
  | 'chat'
  | 'contact'
  | 'app-review';
  
type PartialScanData = {
  image: string;
  analysis: ScanResult['analysis'];
  status: ScanResult['status'];
  confidence: number;
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold text-error mb-4">Something went wrong</h1>
          <p className="text-lg mb-8 max-w-md">The application encountered an unexpected error. Please try refreshing the page.</p>
          <pre className="bg-base-300 p-4 rounded-xl text-xs text-left overflow-auto max-w-full mb-8">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const [screen, setScreen] = useState<Screen>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const [currentScanSession, setCurrentScanSession] = useState<ScanResult[] | null>(null);
  const [currentTirePosition, setCurrentTirePosition] = useState<TirePosition | null>(null);
  const [selectedTireDetails, setSelectedTireDetails] = useState<{ position: TirePosition, side: TireSide } | null>(null);
  const [partialScanData, setPartialScanData] = useState<PartialScanData | null>(null);

  const [pendingFinalRecord, setPendingFinalRecord] = useState<ScanRecord | null>(null);
  const [finalReport, setFinalReport] = useState<ScanRecord | null>(null);
  
  // Initialize history from local storage with reviver for Dates
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>(() => {
    try {
      const saved = localStorage.getItem('scanHistory');
      return saved ? JSON.parse(saved, (key, value) => {
         if (key === 'date' || key === 'timestamp') return new Date(value);
         return value;
      }) : [];
    } catch (e) {
      console.error("Failed to parse scan history", e);
      return [];
    }
  });

  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('chatHistory');
      return saved ? JSON.parse(saved, (key, value) => {
         if (key === 'date' || key === 'timestamp') return new Date(value);
         return value;
      }) : {};
    } catch (e) {
      console.error("Failed to parse chat history", e);
      return {};
    }
  });

  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Bypassed Firebase Auth Listener
  useEffect(() => {
    setIsAuthenticated(true);
    setIsAuthReady(true);
    if (['landing', 'login', 'signup'].includes(screen)) {
      handleLogin();
    }
  }, [screen]);
  
  // Persist history when it changes
  useEffect(() => {
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
  }, [scanHistory]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Handle Stripe redirect success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      console.log("Payment success detected in URL, processing...");
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      handlePaymentSuccess();
    } else if (paymentStatus === 'cancel') {
      console.log("Payment cancel detected in URL");
      window.history.replaceState({}, document.title, window.location.pathname);
      setToast({ id: Date.now(), message: "Payment cancelled.", type: 'warning' });
    }
  }, []);

  const navigate = (newScreen: Screen) => {
    console.log(`Navigating to screen: ${newScreen}`);
    setScreen(newScreen);
  };
  
  const dismissToast = () => setToast(null);

  const handleLogin = () => {
    const isFirstTime = localStorage.getItem('isFirstTimeUser') !== 'false';
    if (isFirstTime) {
      localStorage.setItem('isFirstTimeUser', 'false');
      navigate('intro');
    } else {
      navigate('home');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      navigate('landing');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const startNewScanSession = () => {
    handlePaymentSuccess();
  };

  const handlePaymentSuccess = () => {
    console.log("Executing handlePaymentSuccess...");
    try {
      setCurrentScanSession([]);
      navigate('vehicle-status');
      console.log("handlePaymentSuccess completed successfully");
    } catch (err) {
      console.error("Error in handlePaymentSuccess:", err);
    }
  };
  
  const selectTirePosition = (position: TirePosition) => {
    setCurrentTirePosition(position);
    navigate('tire-detail');
  };

  const selectTireSide = (side: TireSide) => {
    if (!currentTirePosition) return;
    setSelectedTireDetails({ position: currentTirePosition, side });
    navigate('scan');
  };

  const handleScanComplete = (scanData: PartialScanData) => {
    setPartialScanData(scanData);
    const hasDotInfoForPosition = currentScanSession?.some(s => s.tirePosition === currentTirePosition && s.dotInfo);
     if (hasDotInfoForPosition) {
      const existingScan = currentScanSession!.find(s => s.tirePosition === currentTirePosition && s.dotInfo);
      handleCodeScanComplete(existingScan!.dotInfo);
    } else {
      navigate('code-reader');
    }
  };

  const handleCodeScanComplete = (dotInfo?: DOTInfo) => {
    if (!partialScanData || !selectedTireDetails || currentScanSession === null) return;
    
    let sessionWithUpdatedDotInfo = [...currentScanSession];
    if (dotInfo) {
       sessionWithUpdatedDotInfo = sessionWithUpdatedDotInfo.map(scan => 
        scan.tirePosition === selectedTireDetails.position ? { ...scan, dotInfo } : scan
      );
    }

    const newScanResult: ScanResult = {
      ...partialScanData,
      dotInfo,
      tirePosition: selectedTireDetails.position,
      tireSide: selectedTireDetails.side,
    };
    
    const updatedSession = [...sessionWithUpdatedDotInfo];
    const existingScanIndex = updatedSession.findIndex(s => s.tirePosition === newScanResult.tirePosition && s.tireSide === newScanResult.tireSide);
    if(existingScanIndex > -1) {
        updatedSession[existingScanIndex] = newScanResult;
    } else {
        updatedSession.push(newScanResult);
    }

    setCurrentScanSession(updatedSession);
    setSelectedTireDetails(null);
    setPartialScanData(null);
    navigate('tire-detail');
  };

  const handleFinishAndReview = () => {
    if (!currentScanSession || currentScanSession.length === 0) return;

    const newRecord: ScanRecord = {
      id: `scan_${Date.now()}`,
      date: new  Date(),
      title: 'DryRot Scan Report',
      scans: currentScanSession,
      paid: true,
    };
    
    setPendingFinalRecord(newRecord);
    navigate('final-review');
  };
  
  const handleFinalReviewAccept = () => {
    if (!pendingFinalRecord) return;
    setScanHistory(prev => [pendingFinalRecord, ...prev]);
    setFinalReport(pendingFinalRecord);
    setPendingFinalRecord(null);
    setCurrentScanSession(null);
    setCurrentTirePosition(null);
    navigate('result');
  };

  const handleFinalReviewGoBack = () => {
    setPendingFinalRecord(null);
    navigate('vehicle-status');
  }

  const viewHistoryItem = (recordId: string) => {
    const record = scanHistory.find(r => r.id === recordId);
    if (record) {
      setFinalReport(record);
      navigate('result');
    }
  };
  
  const startChat = () => {
    if (finalReport) {
      navigate('chat');
    }
  };
  
  const updateChatHistory = (recordId: string, messages: ChatMessage[]) => {
    setChatHistory(prev => ({
      ...prev,
      [recordId]: messages
    }));
  };

  const goHome = () => {
    setCurrentScanSession(null);
    setFinalReport(null);
    setSelectedTireDetails(null);
    setPartialScanData(null);
    setCurrentTirePosition(null);
    setPendingFinalRecord(null);
    navigate('home');
    window.scrollTo(0, 0);
  };
  
  const handleScanCompletion = () => {
    setToast({ id: Date.now(), message: t('app.scanComplete'), type: 'info' });
    goHome();
  };
  
  const handleMessageSent = () => {
    setToast({ id: Date.now(), message: t('contact.successMessage'), type: 'info' });
    goHome();
  };
  
  const handleReviewSubmitted = () => {
    setToast({ id: Date.now(), message: t('appReview.successMessage'), type: 'info' });
    goHome();
  };
  
  const navigateToLanding = () => {
    navigate('landing');
    window.scrollTo(0, 0);
  };

  const currentView = () => {
    if (!isAuthReady) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-brand-orange"></span>
        </div>
      );
    }

    switch (screen) {
      case 'landing':
        // Updated: Redirects "Start Your First Scan" to SignUp instead of Login
        return <LandingScreen onNavigateToLogin={() => navigate('login')} onNavigateToSignUp={() => navigate('signup')} />;
      case 'login':
        return <LoginScreen onLogin={handleLogin} onBack={() => navigate('landing')} setToast={setToast} />;
      case 'signup':
        return <SignUpScreen onSignUp={handleLogin} onBack={() => navigate('landing')} onNavigateToLogin={() => navigate('login')} setToast={setToast} />;
      case 'intro':
        return <IntroScreen onComplete={goHome} onHome={goHome} />;
      case 'home':
        return <HomeScreen 
                  scanHistory={scanHistory} 
                  onNewScan={startNewScanSession} 
                  onLogout={handleLogout} 
                  onViewRecord={viewHistoryItem} 
                  onHome={navigateToLanding} 
                  onContact={() => navigate('contact')}
                  onRate={() => navigate('app-review')}
                />;
      case 'vehicle-status':
        return <VehicleStatusScreen 
                  scans={currentScanSession ?? []}
                  onSelectPosition={selectTirePosition} 
                  onBack={goHome} 
                  onFinish={handleFinishAndReview}
                />;
      case 'tire-detail':
        return currentTirePosition ? <TireDetailScreen
                  position={currentTirePosition}
                  scannedSides={currentScanSession?.filter(s => s.tirePosition === currentTirePosition).map(s => s.tireSide) ?? []}
                  onSelectSide={selectTireSide}
                  onBack={() => navigate('vehicle-status')}
                /> : <div>Loading...</div>
      case 'payment':
        return <PaymentScreen onPaymentSuccess={handlePaymentSuccess} onBack={goHome} setToast={setToast} />;
      case 'scan':
        return <ScanScreen onScanComplete={handleScanComplete} onBack={() => navigate('tire-detail')} />;
      case 'final-review':
        return pendingFinalRecord ? <FinalReviewScreen 
                                    record={pendingFinalRecord}
                                    onAccept={handleFinalReviewAccept}
                                    onGoBack={handleFinalReviewGoBack}
                                  /> : <div>Loading review...</div>;
      case 'code-reader':
        return <CodeReaderScreen onScanComplete={handleCodeScanComplete} onSkip={() => handleCodeScanComplete(undefined)} onBack={() => navigate('tire-detail')} />;
      case 'result':
        return finalReport ? <ResultScreen record={finalReport} onDone={handleScanCompletion} onHome={goHome} onChat={startChat} /> : <div>Loading result...</div>;
      case 'chat':
        return finalReport ? (
          <ChatScreen 
            record={finalReport} 
            initialMessages={chatHistory[finalReport.id] || []}
            onClose={() => navigate('result')}
            onUpdateMessages={(msgs) => updateChatHistory(finalReport.id, msgs)}
          />
        ) : <div>Loading chat...</div>
      case 'contact':
        return <ContactScreen onBack={goHome} onMessageSent={handleMessageSent} />;
      case 'app-review':
        return <AppReviewScreen onBack={goHome} onReviewSubmitted={handleReviewSubmitted} />;
      default:
        return <LandingScreen onNavigateToLogin={() => navigate('login')} onNavigateToSignUp={() => navigate('signup')} />;
    }
  };
  
  return (
    <div className="font-sans antialiased text-base-content bg-base-100 min-h-screen">
      <ConfigHelper />
      {currentView()}
      {toast && <Toast toast={toast} onDismiss={dismissToast} />}
      <AddToHomeScreenPrompt />
    </div>
  );
};

export default App;
