import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const { lang, toggleLanguage } = useLanguage();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    firstname: '',
    lastname: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // ตรวจสอบรูปแบบอีเมลเบื้องต้น ต้องมี "@" และมีโดเมนตามหลัง
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ตรวจสอบอีเมลก่อนส่งไป backend: ต้องมี "@" ถึงจะลงทะเบียนผ่าน
    if (!formData.email.includes('@') || !isValidEmail(formData.email)) {
      setError(lang === 'en'
        ? 'Please enter a valid email (must contain @, e.g. example@email.com)'
        : 'กรุณากรอกอีเมลให้ถูกต้อง (ต้องมี @ เช่น example@email.com)');
      return;
    }

    if (formData.password.length < 6) {
      setError(lang === 'en'
        ? 'Password must be at least 6 characters long'
        : 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || (lang === 'en'
          ? 'Registration failed, please try again'
          : 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'));
      }

      setSuccess(lang === 'en'
        ? 'Registration successful! Redirecting to login...'
        : 'สมัครสมาชิกสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ...');

      // เคลียร์ฟอร์มแล้วพาไปหน้า login หลังสมัครสำเร็จ
      setFormData({ email: '', username: '', password: '', firstname: '', lastname: '' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message || (lang === 'en'
        ? 'An error occurred, please try again'
        : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* ฝั่งซ้าย */}
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
          <div className="form-header">
            <h2>Video Summary</h2>
            <h3>{lang === 'en' ? 'Create Account' : 'สร้างบัญชีผู้ใช้'}</h3>
            <p className="subtitle">
              {lang === 'en' ? 'Already have an account?' : 'มีบัญชีอยู่แล้ว?'}{' '}
              <a href="/login">{lang === 'en' ? 'Sign in' : 'เข้าสู่ระบบ'}</a>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder={lang === 'en' ? 'Email' : 'อีเมล'}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="username"
              placeholder={lang === 'en' ? 'Username' : 'ชื่อผู้ใช้'}
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder={lang === 'en' ? 'Password' : 'รหัสผ่าน'}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="firstname"
              placeholder={lang === 'en' ? 'First Name' : 'ชื่อจริง'}
              value={formData.firstname}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="lastname"
              placeholder={lang === 'en' ? 'Last Name' : 'นามสกุล'}
              value={formData.lastname}
              onChange={handleChange}
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
                ? (lang === 'en' ? 'Signing up...' : 'กำลังสมัครสมาชิก...')
                : (lang === 'en' ? 'Sign Up' : 'สมัครสมาชิก')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}