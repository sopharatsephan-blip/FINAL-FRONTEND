import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './Register.css'; // ใช้สไตล์เดียวกับหน้า Register

const API_BASE = 'http://localhost:5000/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { lang, toggleLanguage } = useLanguage();

  const [step, setStep] = useState('email'); // 'email' -> 'reset'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // ขั้นที่ 1: เช็คว่ามีอีเมลนี้ในระบบไหม
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.includes('@') || !isValidEmail(email)) {
      setError(lang === 'en'
        ? 'Please enter a valid email (must contain @, e.g. example@email.com)'
        : 'กรุณากรอกอีเมลให้ถูกต้อง (ต้องมี @ เช่น example@email.com)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || (lang === 'en'
          ? 'Email not found in our system'
          : 'ไม่พบอีเมลนี้ในระบบ'));
      }

      // เจออีเมลแล้ว -> ไปขั้นตอนตั้งรหัสผ่านใหม่
      setStep('reset');
    } catch (err) {
      console.error('Check email error:', err);
      setError(err.message || (lang === 'en'
        ? 'An error occurred, please try again'
        : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'));
    } finally {
      setLoading(false);
    }
  };

  // ขั้นที่ 2: ตั้งรหัสผ่านใหม่
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError(lang === 'en'
        ? 'Password must be at least 6 characters long'
        : 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(lang === 'en'
        ? 'Passwords do not match'
        : 'รหัสผ่านทั้งสองช่องไม่ตรงกัน');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || (lang === 'en'
          ? 'Failed to change password, please try again'
          : 'เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'));
      }

      setSuccess(lang === 'en'
        ? 'Password changed successfully! Redirecting to login...'
        : 'เปลี่ยนรหัสผ่านสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ...');

      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || (lang === 'en'
        ? 'An error occurred, please try again'
        : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* ฝั่งซ้าย - อังกฤษตายตัว ไม่แปลภาษา เหมือนหน้า Register/Login */}
      <div className="register-left">
        <div className="brand-section">
          <div className="logo-icon">✻</div>
          <h1>Video<br />Summary System</h1>
          <p>
            Platform for teachers to upload lesson videos and students to
            watch, read summaries, and download notes efficiently.
          </p>
        </div>
      </div>

      {/* ฝั่งขวา */}
      <div className="register-right">
        <button type="button" className="lang-btn" onClick={toggleLanguage}>
          🌐 {lang ? lang.toUpperCase() : 'EN'}
        </button>

        <div className="form-container-box">
          {step === 'email' ? (
            <>
              <div className="form-header">
                <h2>Video Summary</h2>
                <h3>{lang === 'en' ? 'Forgot Password?' : 'ลืมรหัสผ่าน?'}</h3>
                <p className="subtitle">
                  {lang === 'en'
                    ? 'Enter your email to continue.'
                    : 'กรอกอีเมลของคุณเพื่อดำเนินการต่อ'}
                </p>
              </div>

              <form onSubmit={handleCheckEmail}>
                <input
                  type="email"
                  name="email"
                  placeholder={lang === 'en' ? 'Email' : 'อีเมล'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {error && (
                  <p style={{ color: '#f87171', fontSize: '0.85rem', margin: '8px 0 0 0' }}>
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-signup" disabled={loading}>
                  {loading
                    ? (lang === 'en' ? 'Checking...' : 'กำลังตรวจสอบ...')
                    : (lang === 'en' ? 'Continue' : 'ดำเนินการต่อ')}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="form-header">
                <h2>Video Summary</h2>
                <h3>{lang === 'en' ? 'Set New Password' : 'ตั้งรหัสผ่านใหม่'}</h3>
                <p className="subtitle">
                  {lang === 'en'
                    ? `Enter a new password for ${email}`
                    : `กำหนดรหัสผ่านใหม่สำหรับ ${email}`}
                </p>
              </div>

              <form onSubmit={handleResetPassword}>
                <input
                  type="password"
                  name="newPassword"
                  placeholder={lang === 'en' ? 'New Password' : 'รหัสผ่านใหม่'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder={lang === 'en' ? 'Confirm New Password' : 'ยืนยันรหัสผ่านใหม่'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                {error && (
                  <p style={{ color: '#f87171', fontSize: '0.85rem', margin: '8px 0 0 0' }}>
                    {error}
                  </p>
                )}

                {success && (
                  <p style={{ color: '#4ade80', fontSize: '0.85rem', margin: '8px 0 0 0' }}>
                    {success}
                  </p>
                )}

                <button type="submit" className="btn-signup" disabled={loading}>
                  {loading
                    ? (lang === 'en' ? 'Changing...' : 'กำลังเปลี่ยน...')
                    : (lang === 'en' ? 'Change Password' : 'เปลี่ยนรหัสผ่าน')}
                </button>
              </form>

              <p className="subtitle" style={{ marginTop: '14px', textAlign: 'center' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setStep('email'); setError(''); }}>
                  {lang === 'en' ? '← Use a different email' : '← ใช้อีเมลอื่น'}
                </a>
              </p>
            </>
          )}

          <p className="subtitle" style={{ marginTop: '18px', textAlign: 'center' }}>
            {lang === 'en' ? 'Remember your password?' : 'จำรหัสผ่านได้แล้ว?'}{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              {lang === 'en' ? 'Sign in' : 'เข้าสู่ระบบ'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}