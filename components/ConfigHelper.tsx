
import React, { useState, useEffect } from 'react';
import { Settings, AlertCircle, X, ChevronRight, Key } from 'lucide-react';

const ConfigHelper: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [keys, setKeys] = useState({
    publishable: '',
    secret: ''
  });

  useEffect(() => {
    const handleOpenManual = () => setShowManual(true);
    window.addEventListener('open-stripe-setup', handleOpenManual);
    
    try {
      const env = (import.meta as any).env || {};
      const hasKey = !!env.VITE_STRIPE_PUBLISHABLE_KEY;
      console.log('Stripe Key Detection:', { hasKey, envKey: env.VITE_STRIPE_PUBLISHABLE_KEY });
      
      let hasSessionKey = false;
      try {
        hasSessionKey = !!sessionStorage.getItem('VITE_STRIPE_PUBLISHABLE_KEY');
        console.log('Session Key Detection:', { hasSessionKey });
      } catch (e) {}
      
      const isEnvKeySet = !!process.env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (!hasKey && !hasSessionKey && !isEnvKeySet) {
        setIsVisible(true);
      }
    } catch (error) {}

    return () => window.removeEventListener('open-stripe-setup', handleOpenManual);
  }, []);

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (keys.publishable) {
        sessionStorage.setItem('VITE_STRIPE_PUBLISHABLE_KEY', keys.publishable);
      }
      if (keys.secret) {
        sessionStorage.setItem('STRIPE_SECRET_KEY', keys.secret);
      }
      setIsVisible(false);
      setShowManual(false);
      window.location.reload();
    } catch (error) {
      alert("Failed to save keys to session storage. Your browser might be blocking it.");
    }
  };

  if (!isVisible && !showManual) return null;

  return (
    <>
      {isVisible && (
        <div className="bg-error text-error-content p-4 sticky top-0 z-[100] shadow-2xl border-b-4 border-black/20 animate-bounce">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-error-content/20 p-2 rounded-lg">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-xl leading-tight uppercase tracking-tighter">Action Required: Setup Stripe</h3>
                <p className="text-sm font-medium mt-1">
                  Payments will not work until you add your Stripe API keys.
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setShowManual(true)}
                className="btn btn-sm bg-white text-error border-none hover:bg-white/90 font-bold flex-1 md:flex-none shadow-lg"
              >
                Fix This Now
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="btn btn-sm btn-circle btn-ghost text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showManual && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-base-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary">
                    <Key className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">Manual Configuration</h2>
                </div>
                <button onClick={() => setShowManual(false)} className="btn btn-ghost btn-sm btn-circle">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-base-content/70 mb-6">
                For a permanent setup, add <strong>STRIPE_SECRET_KEY</strong> to the <strong>Secrets</strong> menu in the platform settings. 
                Otherwise, you can paste your keys here for this session.
              </p>

              <form onSubmit={handleSaveManual} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Stripe Publishable Key (VITE_STRIPE_PUBLISHABLE_KEY)</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="pk_test_..." 
                    className="input input-bordered w-full font-mono text-sm"
                    value={keys.publishable}
                    onChange={(e) => setKeys({...keys, publishable: e.target.value})}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Stripe Secret Key (STRIPE_SECRET_KEY)</span>
                  </label>
                  <input 
                    type="password" 
                    placeholder="sk_test_..." 
                    className="input input-bordered w-full font-mono text-sm"
                    value={keys.secret}
                    onChange={(e) => setKeys({...keys, secret: e.target.value})}
                    required
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" className="btn btn-primary w-full">
                    Save for this Session
                  </button>
                  <p className="text-[10px] text-center mt-3 text-base-content/50">
                    Note: These keys are stored in your browser's session storage and will be lost if you close the tab.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfigHelper;
