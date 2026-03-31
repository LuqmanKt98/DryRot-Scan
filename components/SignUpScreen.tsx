
import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import LogoIcon from './icons/LogoIcon';
import { auth, db, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface SignUpScreenProps {
  onSignUp: () => void;
  onBack: () => void;
  onNavigateToLogin: () => void;
  setToast: (toast: any) => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onBack, onNavigateToLogin, setToast }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Check if user document already exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date().toISOString(),
          isEmailVerified: true // Google accounts are verified
        });
      }
      
      onSignUp();
    } catch (error: any) {
      console.error("Google signup error:", error);
      setToast({ id: Date.now(), message: "Failed to sign up with Google.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setToast({ id: Date.now(), message: "Passwords do not match", type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with name
      await updateProfile(user, { displayName: name });

      // Send verification email
      await sendEmailVerification(user);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        createdAt: new Date().toISOString(),
        isEmailVerified: false
      });

      setToast({ 
        id: Date.now(), 
        message: "Account created! Please check your email to verify your account.", 
        type: 'success' 
      });
      
      onNavigateToLogin();
    } catch (error: any) {
      console.error("Signup error:", error);
      let message = "Failed to create account.";
      if (error.code === 'auth/email-already-in-use') message = "Email already in use.";
      else if (error.code === 'auth/weak-password') message = "Password is too weak.";
      else if (error.code === 'auth/operation-not-allowed') message = "Email/Password sign-in is not enabled in Firebase Console.";
      else if (error.code === 'permission-denied') message = "Database permission denied. Please check security rules.";
      else if (error.message) message = error.message;
      
      setToast({ id: Date.now(), message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center p-4 animate-fade-in">
      <header className="absolute top-4 left-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-base-300">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      </header>
      <div className="w-full max-w-sm text-center">
        <LogoIcon className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">{t('signup.title')}</h1>
        <p className="mt-2 text-base-content/70">{t('signup.subtitle')}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('signup.namePlaceholder')}
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>
          <div>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('signup.emailPlaceholder')}
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>
          <div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('signup.passwordPlaceholder')}
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>
           <div>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('signup.confirmPasswordPlaceholder')}
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-brand-orange text-white font-bold rounded-xl text-lg hover:bg-brand-orange/90 transition-transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : t('signup.submitButton')}
          </button>
        </form>

        <div className="divider my-6">OR</div>

        <button 
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full py-3 bg-white text-black border border-base-300 font-bold rounded-xl text-lg hover:bg-base-100 transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Sign up with Google
        </button>

        <button onClick={onNavigateToLogin} className="mt-4 text-sm text-brand-orange hover:underline">
          {t('signup.alreadyHaveAccount')}
        </button>
      </div>
    </div>
  );
};

export default SignUpScreen;
