import React, { useEffect } from 'react';

interface PaymentScreenProps {
  onPaymentSuccess: () => void;
  onBack: () => void;
  setToast: (toast: any) => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onPaymentSuccess }) => {
  useEffect(() => {
    onPaymentSuccess();
  }, [onPaymentSuccess]);

  return <div className="min-h-screen flex items-center justify-center">Bypassing...</div>;
};

export default PaymentScreen;
