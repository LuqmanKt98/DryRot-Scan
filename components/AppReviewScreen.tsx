
import React, { useState } from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import StarIcon from './icons/StarIcon';
import { useTranslation } from '../hooks/useTranslation';

interface AppReviewScreenProps {
  onBack: () => void;
  onReviewSubmitted: () => void;
}

const AppReviewScreen: React.FC<AppReviewScreenProps> = ({ onBack, onReviewSubmitted }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onReviewSubmitted();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col animate-fade-in">
      <header className="bg-base-100 shadow-md p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-base-300">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{t('appReview.title')}</h1>
      </header>

      <main className="flex-grow p-6 max-w-2xl mx-auto w-full flex flex-col items-center">
        <div className="bg-base-100 rounded-2xl p-8 shadow-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-2">{t('appReview.title')}</h2>
          <p className="text-base-content/70 mb-6">{t('appReview.subtitle')}</p>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transform transition-transform hover:scale-110"
              >
                <StarIcon 
                    className={`w-10 h-10 ${star <= rating ? 'text-brand-yellow' : 'text-base-300'}`} 
                    filled={star <= rating} 
                />
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="label font-semibold">
                <span className="label-text">{t('appReview.feedbackLabel')}</span>
              </label>
              <textarea 
                className="textarea textarea-bordered w-full h-32 bg-base-200 focus:outline-none focus:border-brand-orange"
                placeholder={t('appReview.placeholder')}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || rating === 0}
              className="w-full py-3 mt-4 bg-brand-orange text-white font-bold rounded-xl text-lg hover:bg-brand-orange/90 transition-transform active:scale-95 disabled:bg-base-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('appReview.submitting') : t('appReview.submitButton')}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AppReviewScreen;
