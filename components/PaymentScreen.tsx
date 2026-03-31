import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { CreditCard, AlertCircle } from 'lucide-react';

interface PaymentScreenProps {
  onPaymentSuccess: () => void;
  onBack: () => void;
  setToast: (toast: any) => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onPaymentSuccess, onBack, setToast }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      setToast({ id: Date.now(), message: error.message || 'Payment processing failed. Please try again.', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      <div className="p-4 flex items-center bg-base-100 shadow-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 text-primary">
          Back
        </button>
        <h1 className="text-xl font-bold ml-2">Checkout</h1>
      </div>

      <div className="p-6">
        <div className="bg-base-100 rounded-xl p-6 shadow-lg mb-6 border border-base-300">
          <h2 className="text-2xl font-bold mb-2">Scan Report</h2>
          <p className="text-base-content/70 mb-6">Complete your purchase to view the AI analysis results.</p>
          
          <div className="flex justify-between items-center py-4 border-t border-b border-base-300 mb-6">
            <span className="text-lg">Full Vehicle Report</span>
            <span className="text-2xl font-bold text-primary">$2.99</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="btn btn-primary w-full h-14 text-lg font-bold rounded-xl flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="loading loading-spinner text-neutral"></span>
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                <span>Pay with Stripe</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
