import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import eadLogo from '../assets/ead-official-logo.jpg';
import loginLeftBg from '../assets/login-left-bg.png';
import loginRightBg from '../assets/login-right-bg.jpg';
import azureIconSvg from '../assets/azureIcon.svg';
import './login.css';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { setCurrentRole } = useMRV();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Check and decrypt/load saved credentials from localStorage on mount
   */
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('savedEmail');
      const savedPassword = localStorage.getItem('savedPassword');

      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (e) {
      console.warn('LocalStorage read exception:', e);
    }
  }, []);

  /**
   * Handle standard credential submission
   */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('savedPassword', password);
      } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
      }

      localStorage.setItem('loginType', 'credentials');
      sessionStorage.setItem('showLoginDocumentModal', 'true');
      setCurrentRole('FACILITY_OPERATOR');

      setTimeout(() => {
        setLoading(false);
        onLoginSuccess();
      }, 400);
    } catch (err) {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  /**
   * Handle Azure AD SSO Login
   */
  const handleAzureLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      localStorage.setItem('loginType', 'azure');
      sessionStorage.setItem('showLoginDocumentModal', 'true');
      setCurrentRole('FACILITY_OPERATOR');

      setTimeout(() => {
        setLoading(false);
        onLoginSuccess();
      }, 400);
    } catch (err) {
      console.error('Azure AD login failed', err);
      setError('Error logging in with Azure AD.');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden select-none font-sans">
      {/* Left Column Background Image (Abu Dhabi City Skyline) */}
      <div className="login-bg-left absolute top-0 left-0 bottom-0 w-1/2 overflow-hidden pointer-events-none">
        <img
          src={loginLeftBg}
          alt="LoginLeftImage"
          className="login-bg-image w-full h-full object-cover object-center"
        />
      </div>

      {/* Right Column Background Image (Industrial Smokestacks) */}
      <div className="login-bg-right absolute top-0 right-0 bottom-0 w-1/2 overflow-hidden pointer-events-none">
        <img
          src={loginRightBg}
          alt="LoginRightImage"
          className="login-bg-image w-full h-full object-cover object-center"
        />
      </div>

      {/* Center Overlay Floating Panel (inner-panel) */}
      <div className="inner-panel">
        
        {/* ================================================================= */}
        {/* LEFT PANEL: Platform Title & Description (inner-right-panel) */}
        {/* ================================================================= */}
        <div className="inner-right-panel">
          <div className="innerrightimg">
            <h4 className="logintext">Abu Dhabi Digital MRV Platform</h4>
            <p className="loginp1">
              A platform for compiling GHG and Air Quality pollutant inventories with transparency, accuracy, and consistency-aligned with MOCCAE National MRV system
            </p>
            <p className="loginp2">Powered by Environment Agency-Abu Dhabi</p>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT PANEL: Login Form (inner-left-panel) */}
        {/* ================================================================= */}
        <div className="inner-left-panel">
          <div className="login-form-wrapper w-full max-w-[340px] sm:max-w-[360px] mx-auto">
            {/* EAD Official Logo */}
            <div className="logo-header-section text-center">
              <img
                src={eadLogo}
                alt="Environment Agency - Abu Dhabi"
                className="img-fluid setLogoWidth mx-auto object-contain"
              />
              <h5 className="login-title">
                Login
              </h5>
            </div>

            <div className="form-content-section mt-3">
              <form onSubmit={handleFormSubmit}>
                {/* Email Field */}
                <div className="form-field-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="form-field-group">
                  <label htmlFor="password-input" className="form-label">
                    Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="password-input"
                      name="password"
                      placeholder="Enter Password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control password-input-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      className="password-toggle-btn"
                      type="button"
                      id="password-addon"
                      onClick={togglePasswordVisibility}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="remember-me-group">
                  <input
                    id="auth-remember-check"
                    type="checkbox"
                    className="remember-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label
                    htmlFor="auth-remember-check"
                    className="remember-label"
                  >
                    Remember Me
                  </label>
                </div>

                {error && (
                  <div className="text-danger text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2 font-medium mb-3 mt-1">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <div className="submit-button">
                  <button
                    type="submit"
                    disabled={loading}
                    className="login-submit-btn"
                  >
                    {loading ? (
                      <span className="Spinner inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin me-2" />
                    ) : null}
                    <span>Login</span>
                  </button>
                </div>

                {/* Login with Divider */}
                <div className="signin-other-title">
                  <span className="login-description">
                    Login with
                  </span>
                </div>

                {/* Azure SSO Button */}
                <div className="azure-sso-wrapper">
                  <button
                    type="button"
                    onClick={handleAzureLogin}
                    className="azure-login-btn"
                    title="Login with Azure Active Directory"
                  >
                    <img
                      src={azureIconSvg}
                      alt="Azure Active Directory"
                      className="azure-icon-img"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;


