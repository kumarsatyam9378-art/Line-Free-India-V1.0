import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { triggerHaptic } from '../utils/haptics';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export interface PremiumAnimatedAuthProps {
  mode: 'customer' | 'business';
}

const getStyles = (accentColor: string, mode: string) => `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(50px, -50px) rotate(90deg); }
    50% { transform: translate(100px, 0) rotate(180deg); }
    75% { transform: translate(50px, 50px) rotate(270deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .auth-wrapper-container * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    color: #fff;
  }

  .auth-wrapper-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #1a1a2e);
    background-size: 400% 400%;
    animation: gradient-shift 15s ease infinite;
    padding: 20px;
    overflow: hidden;
  }
  
  .animated-bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.6;
    animation: float 20s ease-in-out infinite;
  }
  
  .orb-1 {
    width: 400px;
    height: 400px;
    background: ${mode === 'customer' ? 'radial-gradient(circle, #00d4ff, #0891b2)' : 'radial-gradient(circle, #8B5CF6, #6D28D9)'};
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  
  .orb-2 {
    width: 350px;
    height: 350px;
    background: ${mode === 'customer' ? 'radial-gradient(circle, #06b6d4, #0e7490)' : 'radial-gradient(circle, #A855F7, #7E22CE)'};
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }
  
  .orb-3 {
    width: 300px;
    height: 300px;
    background: ${mode === 'customer' ? 'radial-gradient(circle, #22d3ee, #06b6d4)' : 'radial-gradient(circle, #9333EA, #6B21A8)'};
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }
  
  .orb-4 {
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, #f59e0b, #d97706);
    top: 40%;
    right: 25%;
    animation-delay: 6s;
  }
  
  .orb-5 {
    width: 320px;
    height: 320px;
    background: radial-gradient(circle, #ec4899, #be185d);
    top: 25%;
    left: 50%;
    animation-delay: 8s;
  }

  .auth-wrapper {
    position: relative;
    width: 100%;
    max-width: 800px;
    height: 550px;
    border: 2px solid ${accentColor};
    box-shadow: 0 0 40px ${accentColor}, 0 0 80px ${accentColor}40;
    overflow: hidden;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    background: rgba(26, 26, 46, 0.7);
    z-index: 10;
  }

  .auth-wrapper .credentials-panel {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .credentials-panel.signin {
    left: 0;
    padding: 0 40px;
  }

  .credentials-panel.signin .slide-element {
    transform: translateX(0%);
    transition: .7s;
    opacity: 1;
  }

  .credentials-panel.signin .slide-element:nth-child(1) { transition-delay: 2.1s; }
  .credentials-panel.signin .slide-element:nth-child(2) { transition-delay: 2.2s; }
  .credentials-panel.signin .slide-element:nth-child(3) { transition-delay: 2.3s; }
  .credentials-panel.signin .slide-element:nth-child(4) { transition-delay: 2.4s; }
  .credentials-panel.signin .slide-element:nth-child(5) { transition-delay: 2.5s; }
  .credentials-panel.signin .slide-element:nth-child(6) { transition-delay: 2.6s; }
  .credentials-panel.signin .slide-element:nth-child(7) { transition-delay: 2.7s; }

  .auth-wrapper.toggled .credentials-panel.signin .slide-element {
    transform: translateX(-120%);
    opacity: 0;
  }

  .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(1) { transition-delay: 0s; }
  .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(2) { transition-delay: 0.1s; }
  .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(3) { transition-delay: 0.2s; }
  .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(4) { transition-delay: 0.3s; }
  .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(5) { transition-delay: 0.4s; }
  .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(6) { transition-delay: 0.5s; }
  .auth-wrapper.toggled .credentials-panel.signin .slide-element:nth-child(7) { transition-delay: 0.6s; }

  .credentials-panel.signup {
    right: 0;
    padding: 0 60px;
  }

  .credentials-panel.signup .slide-element {
    transform: translateX(120%);
    transition: .7s ease;
    opacity: 0;
    filter: blur(10px);
  }

  .credentials-panel.signup .slide-element:nth-child(1) { transition-delay: 0s; }
  .credentials-panel.signup .slide-element:nth-child(2) { transition-delay: 0.1s; }
  .credentials-panel.signup .slide-element:nth-child(3) { transition-delay: 0.2s; }
  .credentials-panel.signup .slide-element:nth-child(4) { transition-delay: 0.3s; }
  .credentials-panel.signup .slide-element:nth-child(5) { transition-delay: 0.4s; }
  .credentials-panel.signup .slide-element:nth-child(6) { transition-delay: 0.5s; }
  .credentials-panel.signup .slide-element:nth-child(7) { transition-delay: 0.6s; }

  .auth-wrapper.toggled .credentials-panel.signup .slide-element {
    transform: translateX(0%);
    opacity: 1;
    filter: blur(0px);
  }

  .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(1) { transition-delay: 1.7s; }
  .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(2) { transition-delay: 1.8s; }
  .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(3) { transition-delay: 1.9s; }
  .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(4) { transition-delay: 2.0s; }
  .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(5) { transition-delay: 2.1s; }
  .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(6) { transition-delay: 2.2s; }
  .auth-wrapper.toggled .credentials-panel.signup .slide-element:nth-child(7) { transition-delay: 2.3s; }

  .credentials-panel h2 {
    font-size: 32px;
    text-align: center;
    margin-bottom: 10px;
  }

  .credentials-panel .field-wrapper {
    position: relative;
    width: 100%;
    height: 50px;
    margin-top: 20px;
  }

  .field-wrapper input {
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    color: #fff;
    font-weight: 600;
    border-bottom: 2px solid #fff;
    padding-right: 23px;
    transition: .5s;
  }

  .field-wrapper input:focus,
  .field-wrapper input:valid {
    border-bottom: 2px solid ${accentColor};
  }

  .field-wrapper label {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    font-size: 16px;
    color: #fff;
    transition: .5s;
    pointer-events: none;
  }

  .field-wrapper input:focus~label,
  .field-wrapper input:valid~label {
    top: -5px;
    color: ${accentColor};
  }

  .field-wrapper i {
    position: absolute;
    top: 50%;
    right: 0;
    font-size: 18px;
    transform: translateY(-50%);
    color: #fff;
  }

  .field-wrapper input:focus~i,
  .field-wrapper input:valid~i {
    color: ${accentColor};
  }

  .submit-button {
    position: relative;
    width: 100%;
    height: 45px;
    background: transparent;
    border-radius: 40px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    border: 2px solid ${accentColor};
    overflow: hidden;
    z-index: 1;
    transition: all 0.3s ease;
  }

  .submit-button::before {
    content: "";
    position: absolute;
    height: 300%;
    width: 100%;
    background: linear-gradient(#1a1a2e, ${accentColor}, #1a1a2e, ${accentColor});
    top: -100%;
    left: 0;
    z-index: -1;
    transition: .5s;
  }

  .submit-button:hover:before {
    top: 0;
  }
  
  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .google-button {
    position: relative;
    width: 100%;
    height: 45px;
    background: white;
    border-radius: 40px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    border: none;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #333;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }
  
  .google-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }
  
  .google-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 15px 0;
  }
  
  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255,255,255,0.3);
  }
  
  .divider span {
    padding: 0 10px;
    color: rgba(255,255,255,0.6);
    font-size: 13px;
  }
  
  .forgot-password-link {
    text-align: right;
    margin-top: 10px;
  }
  
  .forgot-password-link a {
    color: ${accentColor};
    text-decoration: none;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .forgot-password-link a:hover {
    text-decoration: underline;
    opacity: 0.8;
  }

  .switch-link {
    font-size: 14px;
    text-align: center;
    margin: 15px 0 10px;
  }

  .switch-link a {
    text-decoration: none;
    color: ${accentColor};
    font-weight: 600;
    cursor: pointer;
  }

  .switch-link a:hover {
    text-decoration: underline;
  }

  .welcome-section {
    position: absolute;
    top: 0;
    height: 100%;
    width: 50%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .welcome-section.signin {
    right: 0;
    text-align: right;
    padding: 0 40px 60px 150px;
  }

  .welcome-section.signin .slide-element {
    transform: translateX(0);
    transition: .7s ease;
    opacity: 1;
    filter: blur(0px);
  }

  .welcome-section.signin .slide-element:nth-child(1) { transition-delay: 2.0s; }
  .welcome-section.signin .slide-element:nth-child(2) { transition-delay: 2.1s; }

  .auth-wrapper.toggled .welcome-section.signin .slide-element {
    transform: translateX(120%);
    opacity: 0;
    filter: blur(10px);
  }

  .auth-wrapper.toggled .welcome-section.signin .slide-element:nth-child(1) { transition-delay: 0s; }
  .auth-wrapper.toggled .welcome-section.signin .slide-element:nth-child(2) { transition-delay: 0.1s; }

  .welcome-section.signup {
    left: 0;
    text-align: left;
    padding: 0 150px 60px 38px;
    pointer-events: none;
  }

  .welcome-section.signup .slide-element {
    transform: translateX(-120%);
    transition: .7s ease;
    opacity: 0;
    filter: blur(10PX);
  }

  .welcome-section.signup .slide-element:nth-child(1) { transition-delay: 0s; }
  .welcome-section.signup .slide-element:nth-child(2) { transition-delay: 0.1s; }

  .auth-wrapper.toggled .welcome-section.signup .slide-element {
    transform: translateX(0%);
    opacity: 1;
    filter: blur(0);
  }

  .auth-wrapper.toggled .welcome-section.signup .slide-element:nth-child(1) { transition-delay: 1.7s; }
  .auth-wrapper.toggled .welcome-section.signup .slide-element:nth-child(2) { transition-delay: 1.8s; }

  .welcome-section h2 {
    text-transform: uppercase;
    font-size: 36px;
    line-height: 1.3;
  }

  .welcome-section p {
    font-size: 16px;
  }

  .auth-wrapper .background-shape {
    position: absolute;
    right: 0;
    top: -5px;
    height: 600px;
    width: 850px;
    background: linear-gradient(45deg, #1a1a2e, ${accentColor});
    transform: rotate(10deg) skewY(40deg);
    transform-origin: bottom right;
    transition: 1.5s ease;
    transition-delay: 1.6s;
  }

  .auth-wrapper.toggled .background-shape {
    transform: rotate(0deg) skewY(0deg);
    transition-delay: .5s;
  }

  .auth-wrapper .secondary-shape {
    position: absolute;
    left: 250px;
    top: 100%;
    height: 700px;
    width: 850px;
    background: #1a1a2e;
    border-top: 3px solid ${accentColor};
    transform: rotate(0deg) skewY(0deg);
    transform-origin: bottom left;
    transition: 1.5s ease;
    transition-delay: .5s;
  }

  .auth-wrapper.toggled .secondary-shape {
    transform: rotate(-11deg) skewY(-41deg);
    transition-delay: 1.2s;
  }
  
  .back-button {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 100;
  }
  
  .back-button:hover {
    background: rgba(255,255,255,0.2);
    transform: translateX(-5px);
  }
  
  .back-button i {
    color: white;
    font-size: 18px;
  }

  @media (max-width: 768px) {
    .auth-wrapper-container { padding: 10px; }
    .auth-wrapper {
      height: auto;
      min-height: 550px;
      flex-direction: column;
    }
    .auth-wrapper .credentials-panel,
    .welcome-section { width: 100%; position: relative; }
    .credentials-panel.signin,
    .credentials-panel.signup {
      padding: 40px 30px;
      left: 0;
      right: 0;
    }
    .credentials-panel.signin { display: flex; }
    .credentials-panel.signup { display: none; }
    .auth-wrapper.toggled .credentials-panel.signin { display: none; }
    .auth-wrapper.toggled .credentials-panel.signup { display: flex; }
    .welcome-section { display: none; }
    .credentials-panel h2 { font-size: 28px; margin-bottom: 10px; }
    .auth-wrapper .background-shape,
    .auth-wrapper .secondary-shape { display: none; }
    .field-wrapper { margin-top: 15px; }
  }

  @media (max-width: 480px) {
    .credentials-panel.signin,
    .credentials-panel.signup { padding: 30px 20px; }
    .credentials-panel h2 { font-size: 24px; }
    .field-wrapper input,
    .field-wrapper label { font-size: 14px; }
    .submit-button,
    .google-button { font-size: 14px; height: 40px; }
    .switch-link { font-size: 13px; }
  }
`;

export default function PremiumAnimatedAuth({ mode }: PremiumAnimatedAuthProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, setRole } = useApp();
  const nav = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  const [signUpBusinessName, setSignUpBusinessName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  
  const [forgotEmail, setForgotEmail] = useState('');

  const accentColor = mode === 'customer' ? '#00d4ff' : '#8B5CF6';
  const modeLabel = mode === 'customer' ? 'Customer' : 'Business';

  useEffect(() => {
    const styleId = 'premium-auth-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = getStyles(accentColor, mode);
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [accentColor, mode]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmail(signInEmail, signInPassword);
      
      // Set role FIRST and wait for state update
      setRole(mode);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      triggerHaptic('success');
      
      if (mode === 'customer') {
        nav('/customer/home', { replace: true });
      } else {
        const user = userCredential?.user || auth.currentUser;
        if (user) {
          const businessDoc = await getDoc(doc(db, 'barbers', user.uid));
          if (businessDoc.exists()) {
            nav('/barber/home', { replace: true });
          } else {
            nav('/barber/setup', { replace: true });
          }
        } else {
          nav('/barber/setup', { replace: true });
        }
      }
    } catch (err: any) {
      triggerHaptic('error');
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (mode === 'business' && !signUpBusinessName.trim()) {
      setError('Please enter your business name.');
      triggerHaptic('error');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signUpWithEmail(signUpEmail, signUpPassword);
      if (result?.user && mode === 'business') {
        await result.user.updateProfile({ displayName: signUpBusinessName });
      }
      
      // Set role FIRST and wait for state update
      setRole(mode);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      triggerHaptic('success');
      
      if (mode === 'customer') {
        nav('/customer/setup', { replace: true });
      } else {
        nav('/barber/setup', { replace: true });
      }
    } catch (err: any) {
      triggerHaptic('error');
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please sign in.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithGoogle();
      setRole(mode);
      triggerHaptic('success');
      
      // Wait a bit for auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = userCredential?.user || auth.currentUser;
      
      if (user) {
        if (mode === 'customer') {
          const customerDoc = await getDoc(doc(db, 'customers', user.uid));
          if (customerDoc.exists()) {
            nav('/customer/home', { replace: true });
          } else {
            nav('/customer/setup', { replace: true });
          }
        } else {
          const businessDoc = await getDoc(doc(db, 'barbers', user.uid));
          if (businessDoc.exists()) {
            nav('/barber/home', { replace: true });
          } else {
            nav('/barber/setup', { replace: true });
          }
        }
      } else {
        // Fallback navigation
        if (mode === 'customer') {
          nav('/customer/setup', { replace: true });
        } else {
          nav('/barber/setup', { replace: true });
        }
      }
    } catch (err: any) {
      triggerHaptic('error');
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || resetEmailSent) return;
    if (!forgotEmail.trim()) {
      setError('Please enter your email address.');
      triggerHaptic('error');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setResetEmailSent(true);
      triggerHaptic('success');
    } catch (err: any) {
      triggerHaptic('error');
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePanel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!loading) {
      triggerHaptic('light');
      setIsSignUp(!isSignUp);
      setError('');
      setShowForgotPassword(false);
      setResetEmailSent(false);
    }
  };

  const handleBack = () => {
    triggerHaptic('light');
    if (showForgotPassword) {
      setShowForgotPassword(false);
      setResetEmailSent(false);
      setError('');
    } else {
      nav(-1);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="auth-wrapper-container">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <div className="animated-bg-orb orb-1"></div>
        <div className="animated-bg-orb orb-2"></div>
        <div className="animated-bg-orb orb-3"></div>
        <div className="animated-bg-orb orb-4"></div>
        <div className="animated-bg-orb orb-5"></div>
        <div className="auth-wrapper">
          <div className="back-button" onClick={handleBack}>
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          <div className="credentials-panel signin" style={{ width: '100%', position: 'relative' }}>
            <h2 className="slide-element">Reset Password</h2>
            <p className="slide-element" style={{ textAlign: 'center', fontSize: '14px', marginBottom: '20px', opacity: 0.8 }}>
              Enter your email to receive a password reset link
            </p>
            {resetEmailSent ? (
              <div className="slide-element" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '15px', color: '#10b981', textAlign: 'center', marginBottom: '20px' }}>
                ✓ Reset email sent! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <div className="field-wrapper slide-element">
                  <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} disabled={loading} />
                  <label>Email</label>
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="field-wrapper slide-element">
                  <button className="submit-button" type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
            {error && (
              <div className="slide-element" style={{ marginTop: '20px', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper-container">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <div className="animated-bg-orb orb-1"></div>
      <div className="animated-bg-orb orb-2"></div>
      <div className="animated-bg-orb orb-3"></div>
      <div className="animated-bg-orb orb-4"></div>
      <div className="animated-bg-orb orb-5"></div>
      <div className={`auth-wrapper ${isSignUp ? 'toggled' : ''}`}>
        <div className="back-button" onClick={handleBack}>
          <i className="fa-solid fa-arrow-left"></i>
        </div>
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>
        <div className="credentials-panel signin">
          <h2 className="slide-element">{modeLabel} Login</h2>
          <form onSubmit={handleSignIn}>
            <div className="field-wrapper slide-element">
              <input type="email" required value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} disabled={loading} />
              <label>Email</label>
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="field-wrapper slide-element">
              <input type="password" required value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} disabled={loading} />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>
            <div className="forgot-password-link slide-element">
              <a onClick={() => { setShowForgotPassword(true); setError(''); }}>Forgot Password?</a>
            </div>
            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>
            <div className="divider slide-element"><span>OR</span></div>
            <div className="field-wrapper slide-element">
              <button className="google-button" type="button" onClick={handleGoogleSignIn} disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                  <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                  <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                  <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
            <div className="switch-link slide-element">
              <p>Don't have an account? <br /> <a onClick={togglePanel} className="register-trigger">Sign Up</a></p>
            </div>
          </form>
        </div>
        <div className="welcome-section signin">
          <h2 className="slide-element">WELCOME BACK!</h2>
        </div>
        <div className="credentials-panel signup">
          <h2 className="slide-element">{modeLabel} Register</h2>
          <form onSubmit={handleSignUp}>
            {mode === 'business' && (
              <div className="field-wrapper slide-element">
                <input type="text" required value={signUpBusinessName} onChange={(e) => setSignUpBusinessName(e.target.value)} disabled={loading} />
                <label>Business Name</label>
                <i className="fa-solid fa-briefcase"></i>
              </div>
            )}
            <div className="field-wrapper slide-element">
              <input type="email" required value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} disabled={loading} />
              <label>Email</label>
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="field-wrapper slide-element">
              <input type="password" required value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} disabled={loading} />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>
            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Register'}
              </button>
            </div>
            <div className="divider slide-element"><span>OR</span></div>
            <div className="field-wrapper slide-element">
              <button className="google-button" type="button" onClick={handleGoogleSignIn} disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                  <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                  <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                  <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
            <div className="switch-link slide-element">
              <p>Already have an account? <br /> <a onClick={togglePanel} className="login-trigger">Sign In</a></p>
            </div>
          </form>
        </div>
        <div className="welcome-section signup">
          <h2 className="slide-element">WELCOME!</h2>
        </div>
      </div>
      {error && (
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', maxWidth: '800px', width: '100%', zIndex: 10, position: 'relative' }}>
          {error}
        </div>
      )}
    </div>
  );
}
