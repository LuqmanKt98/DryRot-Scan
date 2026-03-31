
import React, { useState } from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import MailIcon from './icons/MailIcon';
import { useTranslation } from '../hooks/useTranslation';

interface ContactScreenProps {
  onBack: () => void;
  onMessageSent: () => void;
}

const ContactScreen: React.FC<ContactScreenProps> = ({ onBack, onMessageSent }) => {
  const { t } = useTranslation();
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      onMessageSent();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col animate-fade-in">
      <header className="bg-base-100 shadow-md p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-base-300">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{t('contact.title')}</h1>
      </header>

      <main className="flex-grow p-6 max-w-2xl mx-auto w-full">
        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-brand-blue/10 rounded-full">
                    <MailIcon className="w-12 h-12 text-brand-blue" />
                </div>
            </div>
            
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label font-semibold">
                <span className="label-text">{t('contact.nameLabel')}</span>
              </label>
              <input required type="text" className="input input-bordered w-full bg-base-200 focus:outline-none focus:border-brand-orange" />
            </div>
            
            <div>
              <label className="label font-semibold">
                <span className="label-text">{t('contact.emailLabel')}</span>
              </label>
              <input required type="email" className="input input-bordered w-full bg-base-200 focus:outline-none focus:border-brand-orange" />
            </div>
            
            <div>
              <label className="label font-semibold">
                <span className="label-text">{t('contact.subjectLabel')}</span>
              </label>
               <select className="select select-bordered w-full bg-base-200 focus:outline-none focus:border-brand-orange">
                  <option>General Inquiry</option>
                  <option>Report a Bug</option>
                  <option>Billing Support</option>
                  <option>Other</option>
               </select>
            </div>

            <div>
              <label className="label font-semibold">
                <span className="label-text">{t('contact.messageLabel')}</span>
              </label>
              <textarea required className="textarea textarea-bordered w-full h-32 bg-base-200 focus:outline-none focus:border-brand-orange"></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSending}
              className="w-full py-3 mt-4 bg-brand-orange text-white font-bold rounded-xl text-lg hover:bg-brand-orange/90 transition-transform active:scale-95 disabled:bg-base-300"
            >
              {isSending ? t('contact.sending') : t('contact.sendButton')}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ContactScreen;
