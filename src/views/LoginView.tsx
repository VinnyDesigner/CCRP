import React, { useState, useRef, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Building2,
  Sparkles,
  Lock,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Layers,
  LogIn,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RotateCcw,
  Check,
  ShieldCheck,
  ChevronDown,
  Leaf,
  Users,
  Globe,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { UserRole } from '../types/mrv';
import { FieldTooltip } from '../components/ui/FieldTooltip';
import eadLogo from '../assets/logo.svg';
import loginBg from '../assets/login-bg.png';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'register_details' | 'register_otp' | 'register_success';

const COUNTRY_DIAL_CODES = [
  { code: '+971', country: 'UAE', iso: 'AE' },
  { code: '+966', country: 'Saudi Arabia', iso: 'SA' },
  { code: '+974', country: 'Qatar', iso: 'QA' },
  { code: '+965', country: 'Kuwait', iso: 'KW' },
  { code: '+968', country: 'Oman', iso: 'OM' },
  { code: '+973', country: 'Bahrain', iso: 'BH' },
  { code: '+20', country: 'Egypt', iso: 'EG' },
  { code: '+44', country: 'UK', iso: 'GB' },
  { code: '+1', country: 'USA / Canada', iso: 'US' },
  { code: '+91', country: 'India', iso: 'IN' },
  { code: '+49', country: 'Germany', iso: 'DE' },
  { code: '+33', country: 'France', iso: 'FR' },
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { setCurrentRole } = useMRV();

  // Mode State: login | register_details | register_otp | register_success
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Language State: 'en' | 'ar'
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('ahmed.zaabi@alnoor-energy.ae');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Registration Form State (Prefilled for demo purpose)
  const [regForm, setRegForm] = useState({
    firstName: 'Ahmed',
    lastName: 'Al Zaabi',
    email: 'ahmed.zaabi@alnoor-energy.ae',
    phone: '50 123 4567',
    entityName: 'Al Noor Energy LLC',
    entityDescription: 'Oil & gas exploration and refining industrial facility',
  });
  const [regErrors, setRegErrors] = useState<{ [key: string]: string }>({});

  // OTP State (6 Digits - prefilled for demo purpose)
  const [otpDigits, setOtpDigits] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [otpError, setOtpError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [selectedDialCode, setSelectedDialCode] = useState('+971');
  const [isDialCodeDropdownOpen, setIsDialCodeDropdownOpen] = useState(false);
  const dialCodeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dial code dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialCodeDropdownRef.current && !dialCodeDropdownRef.current.contains(event.target as Node)) {
        setIsDialCodeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // OTP Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authMode === 'register_otp' && otpCountdown > 0) {
      timer = setTimeout(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    } else if (otpCountdown === 0) {
      setCanResendOtp(true);
    }
    return () => clearTimeout(timer);
  }, [authMode, otpCountdown]);

  // Handle Standard Login
  const handleSignIn = (role: UserRole = 'FACILITY_OPERATOR') => {
    setIsLoading(true);
    setCurrentRole(role);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  // Step 1: Validate Details and Send Email OTP (Demo Flow)
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    if (!regForm.firstName.trim()) errors.firstName = 'First name is required';
    if (!regForm.lastName.trim()) errors.lastName = 'Last name is required';
    if (!regForm.email.trim()) errors.email = 'Email is required';
    if (!regForm.entityName.trim()) errors.entityName = 'Entity name is required';

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }

    setRegErrors({});
    setIsLoading(true);

    // Simulate sending Email OTP
    setTimeout(() => {
      setIsLoading(false);
      setOtpDigits(['1', '2', '3', '4', '5', '6']);
      setOtpError('');
      setOtpCountdown(60);
      setCanResendOtp(false);
      setAuthMode('register_otp');
    }, 600);
  };

  // Handle OTP Input Change & Auto-Advance
  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto-advance to next input if digit entered
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP Backspace & Arrow Navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP Paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setOtpDigits(newDigits);
    setOtpError('');

    const nextIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  // Quick Auto-fill Sample OTP (123456)
  const handleQuickFillOtp = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setOtpError('');
  };

  // Resend OTP Code
  const handleResendOtp = () => {
    if (!canResendOtp) return;
    setOtpCountdown(60);
    setCanResendOtp(false);
    setOtpError('');
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    // focus first
    otpInputRefs.current[0]?.focus();
  };

  // Step 2: Confirm OTP & Complete Registration (Demo Flow)
  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpVerifying(true);
    setOtpError('');

    // Simulate OTP verification
    setTimeout(() => {
      setIsOtpVerifying(false);
      setAuthMode('register_success');
    }, 600);
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col lg:flex-row text-white overflow-x-hidden overflow-y-auto select-none bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      {/* Blue Overlay with 20% Opacity */}
      <div className="absolute inset-0 bg-[#06182B]/20 pointer-events-none z-0" />

      {/* Top-Right Language Switcher Toggle */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-30">
        <div
          role="group"
          aria-label="Language Selector"
          className="inline-flex items-center p-[3px] rounded-full bg-[#CBE7F9]/90 backdrop-blur-md border-[2.5px] border-white shadow-[0_4px_16px_rgba(0,30,60,0.18)] select-none"
        >
          {/* EN Button */}
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
              language === 'en'
                ? 'bg-[#004B87] text-white shadow-sm'
                : 'text-[#043358] hover:text-[#021f36]'
            }`}
          >
            EN
          </button>

          {/* AR Button */}
          <button
            type="button"
            onClick={() => setLanguage('ar')}
            className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
              language === 'ar'
                ? 'bg-[#004B87] text-white shadow-sm'
                : 'text-[#043358] hover:text-[#021f36]'
            }`}
            style={{ fontFamily: 'sans-serif' }}
          >
            عربي
          </button>
        </div>
      </div>

      {/* LEFT SIDE: Visual Hero Area (58% width on desktop) */}
      <div className="relative lg:w-[56%] xl:w-[58%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-10">
        {/* Top Logo */}
        <div className="flex items-center z-10">
          <img
            src={eadLogo}
            alt="Environment Agency - Abu Dhabi"
            className="h-16 sm:h-20 w-auto max-w-[280px] object-contain drop-shadow-2xl"
          />
        </div>

        {/* Center Hero Copy */}
        <div className="my-10 lg:my-auto max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#082235]/80 backdrop-blur-md border border-[#00B2FE]/30 text-[#00B2FE] text-xs font-semibold mb-6 shadow-md">
            <span>Climate Change Registry Portal (CCRP)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold font-display leading-[1.15] tracking-tight text-white">
            Track Climate Action. <br />
            <span className="text-[#00B2FE] whitespace-normal sm:whitespace-nowrap">
              Report Progress. Drive Impact.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300/90 mt-4 leading-relaxed font-normal max-w-xl">
            A secure digital platform for registering climate change initiatives, reporting progress, tracking performance, and monitoring KPIs across Abu Dhabi’s Climate Change Strategy and Adaptation Plan.
          </p>

          {/* 4 Feature Glass Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-2xl">
            {/* Card 1: Project Registration */}
            <div className="relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-white/15 via-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:border-[#00B2FE]/60 hover:bg-white/20 hover:shadow-[0_12px_36px_rgba(0,178,254,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden">
              <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#00B2FE]/15 to-transparent pointer-events-none rounded-b-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="mb-2.5 text-[#00B2FE] drop-shadow-[0_2px_10px_rgba(0,178,254,0.5)] group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300">
                  <Leaf className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white tracking-wide">Project Registration</h4>
                <p className="text-[11px] text-slate-300/90 mt-1 leading-snug font-normal">
                  Register and manage climate initiatives
                </p>
              </div>
            </div>

            {/* Card 2: Performance Tracking */}
            <div className="relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-white/15 via-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:border-[#00B2FE]/60 hover:bg-white/20 hover:shadow-[0_12px_36px_rgba(0,178,254,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden">
              <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#00B2FE]/15 to-transparent pointer-events-none rounded-b-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="mb-2.5 text-[#00B2FE] drop-shadow-[0_2px_10px_rgba(0,178,254,0.5)] group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white tracking-wide">Performance Tracking</h4>
                <p className="text-[11px] text-slate-300/90 mt-1 leading-snug font-normal">
                  Track progress, targets and milestones
                </p>
              </div>
            </div>

            {/* Card 3: Centralized Data */}
            <div className="relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-white/15 via-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:border-[#00B2FE]/60 hover:bg-white/20 hover:shadow-[0_12px_36px_rgba(0,178,254,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden">
              <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#00B2FE]/15 to-transparent pointer-events-none rounded-b-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="mb-2.5 text-[#00B2FE] drop-shadow-[0_2px_10px_rgba(0,178,254,0.5)] group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white tracking-wide">Centralized Data</h4>
                <p className="text-[11px] text-slate-300/90 mt-1 leading-snug font-normal">
                  Submit, review and track data
                </p>
              </div>
            </div>

            {/* Card 4: Collaborative Action */}
            <div className="relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-white/15 via-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:border-[#00B2FE]/60 hover:bg-white/20 hover:shadow-[0_12px_36px_rgba(0,178,254,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden">
              <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#00B2FE]/15 to-transparent pointer-events-none rounded-b-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="mb-2.5 text-[#00B2FE] drop-shadow-[0_2px_10px_rgba(0,178,254,0.5)] group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white tracking-wide">Collaborative Action</h4>
                <p className="text-[11px] text-slate-300/90 mt-1 leading-snug font-normal">
                  Enable data driven decisions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Floating Authentication Panel */}
      <div className="relative lg:w-[44%] xl:w-[42%] flex items-center justify-center lg:justify-start lg:pl-8 xl:pl-10 p-5 sm:p-8 lg:p-10 z-20 overflow-y-auto">
        <div className="w-full max-w-sm sm:max-w-md relative z-20 my-auto py-4">
          {/* Frosted White & Blue Glass Card */}
          <div className="p-8 sm:p-9 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/60 shadow-[0_24px_50px_rgba(0,30,60,0.25),0_0_0_1px_rgba(255,255,255,0.8)_inset] relative overflow-hidden">
            {/* ============================================================= */}
            {/* VIEW 1: LOGIN FORM */}
            {/* ============================================================= */}
            {authMode === 'login' && (
              <div className="animate-in fade-in duration-200">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#003A70] tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-xs text-slate-500 mt-1.5 font-normal">
                    Sign in to your Climate Change Registry Portal
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSignIn('FACILITY_OPERATOR');
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#003A70] mb-1.5">
                      Email
                    </label>
                    <FieldTooltip
                      content="Enter your registered corporate or government CCRP account email."
                      example="ahmed.zaabi@alnoor-energy.ae"
                    >
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter Email"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/85 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-medium border border-slate-200/90 focus:border-[#0072CE] focus:outline-none focus:ring-2 focus:ring-[#0072CE]/20 transition-all shadow-sm"
                      />
                    </FieldTooltip>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#003A70] mb-1.5">
                      Password
                    </label>
                    <FieldTooltip content="Enter your confidential account password.">
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter Password"
                          className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-white/85 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-medium border border-slate-200/90 focus:border-[#0072CE] focus:outline-none focus:ring-2 focus:ring-[#0072CE]/20 transition-all shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#003A70] transition-colors cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FieldTooltip>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 pb-0.5 whitespace-nowrap">
                    <FieldTooltip content="Keep your authentication session persistent on this browser workstation.">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-600 whitespace-nowrap select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-[#0072CE] focus:ring-[#0072CE] cursor-pointer shrink-0"
                        />
                        <span className="font-semibold text-slate-600 whitespace-nowrap">Remember Me</span>
                      </label>
                    </FieldTooltip>

                    <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[#0072CE] hover:text-[#004B87] font-semibold transition-colors whitespace-nowrap shrink-0 ml-2">
                      Forgot Password?
                    </a>
                  </div>

                  {/* 3D Tactile CTA Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#004B87] via-[#006EAF] to-[#009CEB] border-t border-white/40 border-x border-white/10 border-b-2 border-[#002B52] shadow-[0_8px_20px_-4px_rgba(0,75,135,0.4),inset_0_1px_1px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(0,0,0,0.2)] hover:brightness-110 hover:shadow-[0_10px_24px_-4px_rgba(0,75,135,0.55)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none group"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-200 group-hover:translate-x-0.5" />
                          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] tracking-wide font-bold">Login</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider: or */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 text-slate-400 font-semibold bg-white/80 rounded-full">
                      or
                    </span>
                  </div>
                </div>

                {/* Azure AD SSO Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleSignIn('FACILITY_OPERATOR')}
                    className="w-11 h-11 p-2 rounded-2xl bg-[#0072CE] hover:bg-[#005A9E] text-white shadow-md shadow-[#0072CE]/30 hover:scale-105 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                    title="Single Sign-On with Azure Active Directory (Azure AD)"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="50" y1="21" x2="21" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="50" y1="21" x2="79" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="50" y1="21" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="21" y1="50" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="79" y1="50" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <circle cx="50" cy="21" r="10.5" fill="currentColor" />
                      <circle cx="21" cy="50" r="10.5" fill="currentColor" />
                      <circle cx="79" cy="50" r="10.5" fill="currentColor" />
                      <circle cx="50" cy="79" r="10.5" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                {/* Don't have an account? Register Link */}
                <div className="mt-4 text-center text-xs">
                  <span className="text-slate-600">Don't have an account?</span>{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setRegErrors({});
                      setRegForm({
                        firstName: 'Ahmed',
                        lastName: 'Al Zaabi',
                        email: 'ahmed.zaabi@alnoor-energy.ae',
                        phone: '50 123 4567',
                        entityName: 'Al Noor Energy LLC',
                        entityDescription: 'Oil & gas exploration and refining industrial facility',
                      });
                      setAuthMode('register_details');
                    }}
                    className="text-[#0072CE] hover:text-[#004B87] font-bold underline cursor-pointer transition-colors"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* VIEW 2: REGISTRATION - STEP 1: USER DETAILS */}
            {/* ============================================================= */}
            {authMode === 'register_details' && (
              <div className="animate-in fade-in duration-200">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#003A70] tracking-tight">
                    Create an Account
                  </h2>
                  <p className="text-xs text-slate-500 mt-1.5 font-normal">
                    Register your data provider account for the MRV Platform
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  {/* First Name & Last Name in 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#003A70] mb-1">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regForm.firstName}
                        onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                        placeholder="Enter first name"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#F4F8FC] hover:bg-[#EEF4FB] focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-medium border border-slate-200/90 focus:border-[#0072CE] focus:outline-none focus:ring-2 focus:ring-[#0072CE]/20 transition-all shadow-sm ${
                          regErrors.firstName ? '!border-rose-500' : ''
                        }`}
                      />
                      {regErrors.firstName && (
                        <p className="text-[10px] text-rose-500 font-medium mt-0.5">{regErrors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#003A70] mb-1">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regForm.lastName}
                        onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                        placeholder="Enter last name"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#F4F8FC] hover:bg-[#EEF4FB] focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-medium border border-slate-200/90 focus:border-[#0072CE] focus:outline-none focus:ring-2 focus:ring-[#0072CE]/20 transition-all shadow-sm ${
                          regErrors.lastName ? '!border-rose-500' : ''
                        }`}
                      />
                      {regErrors.lastName && (
                        <p className="text-[10px] text-rose-500 font-medium mt-0.5">{regErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email & Phone Number in 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#003A70] mb-1">
                        Email <span className="text-rose-500">*</span>
                      </label>
                      <FieldTooltip
                        content="Official corporate email address for account authentication and regulatory communication."
                        format="name@company.ae"
                        example="ahmed.zaabi@alnoor-energy.ae"
                        value={regForm.email}
                      >
                        <input
                          type="email"
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          placeholder="name@company.ae"
                          className={`w-full px-3.5 py-2.5 rounded-lg bg-[#F4F8FC] hover:bg-[#EEF4FB] focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-medium border border-slate-200/90 focus:border-[#0072CE] focus:outline-none focus:ring-2 focus:ring-[#0072CE]/20 transition-all shadow-sm ${
                            regErrors.email ? '!border-rose-500' : ''
                          }`}
                        />
                      </FieldTooltip>
                      {regErrors.email && (
                        <p className="text-[10px] text-rose-500 font-medium mt-0.5">{regErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#003A70] mb-1">
                        Phone Number <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                      </label>
                      <div ref={dialCodeDropdownRef} className="relative">
                        <div className="flex items-center rounded-lg bg-[#F4F8FC] hover:bg-[#EEF4FB] focus-within:bg-white border border-slate-200/90 focus-within:border-[#0072CE] focus-within:ring-2 focus-within:ring-[#0072CE]/20 transition-all shadow-sm px-2.5 h-[34px] min-h-[34px]">
                          {/* Active Dial Code Dropdown Trigger */}
                          <button
                            type="button"
                            onClick={() => setIsDialCodeDropdownOpen(!isDialCodeDropdownOpen)}
                            className="flex items-center gap-1.5 pr-2.5 border-r border-slate-300 shrink-0 cursor-pointer select-none text-slate-800 hover:text-[#004B87] font-bold text-xs font-mono transition-colors focus:outline-none focus:ring-0"
                            title="Select Country Code"
                          >
                            <span>{selectedDialCode}</span>
                            <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${isDialCodeDropdownOpen ? 'rotate-180 text-[#004B87]' : ''}`} />
                          </button>

                          {/* Phone Number Input */}
                          <div className="flex items-center flex-1 min-w-0 pl-2.5">
                            <input
                              type="tel"
                              value={regForm.phone}
                              onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                              placeholder="50 123 4567"
                              className="w-full min-w-0 !bg-transparent text-slate-900 placeholder-slate-400 text-xs font-medium focus:!outline-none !border-none !p-0 !h-full !min-h-0 !shadow-none focus:!ring-0 font-mono"
                              style={{ height: '100%', minHeight: 'unset', border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none' }}
                            />
                          </div>
                        </div>

                        {/* Active Dial Code Dropdown Menu */}
                        {isDialCodeDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-1 w-full max-h-44 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1 text-xs custom-scrollbar animate-in fade-in zoom-in-95 duration-150">
                            {COUNTRY_DIAL_CODES.map((item) => (
                              <button
                                key={item.code + item.iso}
                                type="button"
                                onClick={() => {
                                  setSelectedDialCode(item.code);
                                  setIsDialCodeDropdownOpen(false);
                                }}
                                className={`w-full px-2.5 py-1.5 text-left flex items-center justify-between hover:bg-[#E9F1F8] transition-colors cursor-pointer ${
                                  selectedDialCode === item.code ? 'bg-[#E9F1F8] text-[#004B87] font-bold' : 'text-slate-700 font-medium'
                                }`}
                              >
                                <span className="truncate text-[11px]">{item.country}</span>
                                <span className="font-mono text-slate-500 text-[11px] font-bold shrink-0 ml-1">{item.code}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Entity Name & Entity Description in 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#003A70] mb-1">
                        Entity Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={regForm.entityName}
                        onChange={(e) => setRegForm({ ...regForm, entityName: e.target.value })}
                        placeholder="Enter entity name"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-[#F4F8FC] hover:bg-[#EEF4FB] focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-medium border border-slate-200/90 focus:border-[#0072CE] focus:outline-none focus:ring-2 focus:ring-[#0072CE]/20 transition-all shadow-sm ${
                          regErrors.entityName ? '!border-rose-500' : ''
                        }`}
                      />
                      {regErrors.entityName && (
                        <p className="text-[10px] text-rose-500 font-medium mt-0.5">{regErrors.entityName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#003A70] mb-1">
                        Entity Description
                      </label>
                      <FieldTooltip
                        content="Brief overview of the legal entity scope, industrial activities, and operational remit."
                        example="Oil & gas exploration and refining industrial facility"
                        value={regForm.entityDescription}
                      >
                        <input
                          type="text"
                          value={regForm.entityDescription}
                          onChange={(e) => setRegForm({ ...regForm, entityDescription: e.target.value })}
                          placeholder="Enter entity description"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#F4F8FC] hover:bg-[#EEF4FB] focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-medium border border-slate-200/90 focus:border-[#0072CE] focus:outline-none focus:ring-2 focus:ring-[#0072CE]/20 transition-all shadow-sm"
                        />
                      </FieldTooltip>
                    </div>
                  </div>

                  {/* Send Email OTP CTA Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#004B87] via-[#006EAF] to-[#009CEB] border-t border-white/40 border-x border-white/10 border-b-2 border-[#002B52] shadow-[0_8px_20px_-4px_rgba(0,75,135,0.4),inset_0_1px_1px_rgba(255,255,255,0.65)] hover:brightness-110 hover:shadow-[0_10px_24px_-4px_rgba(0,75,135,0.55)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none group"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send Email OTP</span>
                          <ArrowRight className="w-4 h-4 text-white/90 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider: or */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 text-slate-400 font-semibold bg-white rounded-full">
                      or
                    </span>
                  </div>
                </div>

                {/* Azure AD SSO Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleSignIn('FACILITY_OPERATOR')}
                    className="w-11 h-11 p-2 rounded-2xl bg-[#0072CE] hover:bg-[#005A9E] text-white shadow-md shadow-[#0072CE]/30 hover:scale-105 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                    title="Register with Azure Active Directory (Azure AD)"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="50" y1="21" x2="21" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="50" y1="21" x2="79" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="50" y1="21" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="21" y1="50" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="79" y1="50" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <circle cx="50" cy="21" r="10.5" fill="currentColor" />
                      <circle cx="21" cy="50" r="10.5" fill="currentColor" />
                      <circle cx="79" cy="50" r="10.5" fill="currentColor" />
                      <circle cx="50" cy="79" r="10.5" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                {/* Already have an account? Sign in */}
                <div className="mt-4 text-center text-xs">
                  <span className="text-slate-600">Already have an account?</span>{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-[#0072CE] hover:text-[#004B87] font-bold underline cursor-pointer transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* VIEW 3: REGISTRATION - STEP 2: CONFIRM OTP */}
            {/* ============================================================= */}
            {authMode === 'register_otp' && (
              <div className="animate-in fade-in duration-200">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#003A70] tracking-tight">
                    Confirm OTP
                  </h2>
                  <p className="text-xs text-slate-500 mt-1.5 font-normal leading-relaxed max-w-xs mx-auto">
                    We sent a 6-digit verification code to <span className="font-bold text-[#003A70]">{regForm.email || 'your email'}</span>
                  </p>
                </div>

                <form onSubmit={handleConfirmOtp} className="space-y-4">
                  {/* 6-Digit OTP Boxes */}
                  <div>
                    <label className="block text-xs font-bold text-[#003A70] text-center mb-2.5">
                      Enter 6-Digit Code
                    </label>
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={idx === 0 ? handleOtpPaste : undefined}
                          className="!w-[42px] !h-[42px] !min-w-[42px] !min-h-[42px] text-center text-base font-bold font-mono rounded-xl bg-[#F4F8FC] hover:bg-[#EEF4FB] focus:bg-white text-slate-900 border-2 border-slate-200/90 focus:border-[#0072CE] focus:ring-2 focus:ring-[#0072CE]/20 focus:outline-none transition-all shadow-sm p-0"
                          style={{ width: '42px', height: '42px', minWidth: '42px', minHeight: '42px' }}
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="text-xs text-rose-500 text-center font-medium mt-2">{otpError}</p>
                    )}
                  </div>

                  {/* Resend & Demo Helper Row */}
                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <button
                      type="button"
                      onClick={handleQuickFillOtp}
                      className="text-[11px] text-[#0072CE] hover:text-[#004B87] font-semibold underline cursor-pointer"
                      title="Auto-fill sample OTP code"
                    >
                      Quick Fill (123456)
                    </button>

                    <div>
                      {canResendOtp ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-[#0072CE] hover:text-[#004B87] font-bold underline flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Resend Code</span>
                        </button>
                      ) : (
                        <span className="text-slate-500">
                          Resend in <span className="font-bold text-slate-700">{otpCountdown}s</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons: Secondary [Back] + Primary [Confirm OTP] */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('register_details')}
                      className="w-full py-3.5 px-4 text-xs sm:text-sm font-semibold text-slate-700 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-[0.98]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isOtpVerifying}
                      className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#004B87] via-[#006EAF] to-[#009CEB] border-t border-white/40 border-x border-white/10 border-b-2 border-[#002B52] shadow-[0_8px_20px_-4px_rgba(0,75,135,0.4),inset_0_1px_1px_rgba(255,255,255,0.65)] hover:brightness-110 hover:shadow-[0_10px_24px_-4px_rgba(0,75,135,0.55)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none group"
                    >
                      {isOtpVerifying ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-white" />
                          <span>Confirm OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ============================================================= */}
            {/* VIEW 4: REGISTRATION SUCCESS */}
            {/* ============================================================= */}
            {authMode === 'register_success' && (
              <div className="text-center py-2 animate-in zoom-in-95 duration-200">
                {/* Success Icon */}
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(16,185,129,0.2)]">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <h2 className="text-2xl font-semibold text-[#003A70] tracking-tight">
                  Successfully Registered!
                </h2>

                <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed max-w-xs mx-auto">
                  Welcome, <span className="font-bold text-[#003A70]">{regForm.firstName || 'Ahmed'} {regForm.lastName || 'Al Zaabi'}</span>. Your data provider account has been created and verified.
                </p>

                {/* Account Summary Chip */}
                <div className="mt-4 p-3.5 bg-[#F4F8FC] rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Account:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[180px]">{regForm.email || 'ahmed.zaabi@alnoor-energy.ae'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Entity:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[180px]">{regForm.entityName || 'Al Noor Energy LLC'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Role:</span>
                    <span className="font-bold text-[#0072CE]">Data Provider</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Proceed to Dashboard CTA Button */}
                <button
                  type="button"
                  onClick={() => handleSignIn('FACILITY_OPERATOR')}
                  className="w-full py-3.5 px-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#00875A] via-[#00A86B] to-[#10B981] border-t border-white/40 border-x border-white/10 border-b-2 border-[#005A3C] shadow-[0_8px_20px_-4px_rgba(0,135,90,0.4),inset_0_1px_1px_rgba(255,255,255,0.65)] hover:brightness-110 hover:shadow-[0_10px_24px_-4px_rgba(0,135,90,0.55)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-5 cursor-pointer select-none"
                >
                  <span>Proceed to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (regForm.email) setLoginEmail(regForm.email);
                      setAuthMode('login');
                    }}
                    className="text-xs text-slate-500 hover:text-[#003A70] underline cursor-pointer transition-colors font-medium"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
