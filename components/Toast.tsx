
import React, { useEffect } from 'react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast, onDismiss]);

  const bgColor = {
    info: 'bg-brand-blue',
    warning: 'bg-brand-yellow text-black',
    error: 'bg-brand-red',
  }[toast.type];

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-white font-semibold shadow-lg animate-fade-in-up ${bgColor}`}>
      {toast.message}
    </div>
  );
};

export default Toast;
