
import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import LogoIcon from './icons/LogoIcon';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

interface LoginScreenProps {
  onLogin: () => void;
  onBack: () => void;
  setToast: (toast: any) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack, setToast }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (error: any) {
      console.error("Google login error:", error);
      setToast({ id: Date.now(), message: "Failed to sign in with Google.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setToast({ 
          id: Date.now(), 
          message: "Please verify your email before signing in.", 
          type: 'warning' 
        });
        
        // Optionally resend verification email
        // await sendEmailVerification(user);
        
        await auth.signOut();
        return;
      }

      onLogin();
    } catch (error: any) {
      console.error("Login error:", error);
      let message = "Invalid email or password.";
      if (error.code === 'auth/user-not-found') message = "No account found with this email.";
      else if (error.code === 'auth/wrong-password') message = "Incorrect password.";
      else if (error.code === 'auth/too-many-requests') message = "Too many failed attempts. Try again later.";
      else if (error.code === 'auth/invalid-credential') message = "Invalid email or password.";
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
        <h1 className="text-3xl font-bold">{t('login.title')}</h1>
        <p className="mt-2 text-base-content/70">{t('login.subtitle')}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
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
              placeholder={t('login.passwordPlaceholder')}
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-brand-orange text-white font-bold rounded-xl text-lg hover:bg-brand-orange/90 transition-transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : t('login.signInButton')}
          </button>
        </form>

        <div className="divider my-6">OR</div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 bg-white text-black border border-base-300 font-bold rounded-xl text-lg hover:bg-base-100 transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
