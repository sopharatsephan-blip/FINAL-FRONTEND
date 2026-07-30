import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();

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
      setError('กรุณากรอกอีเมลให้ถูกต้อง (ต้องมี @ เช่น example@email.com)');
      return;
    }

    if (formData.password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
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
        throw new Error(data.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }

      setSuccess('สมัครสมาชิกสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ...');

      // เคลียร์ฟอร์มแล้วพาไปหน้า login หลังสมัครสำเร็จ
      setFormData({ email: '', username: '', password: '', firstname: '', lastname: '' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
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
        <div className="footer-text">
          © 2026 Video Summary System. All rights reserved.
        </div>
      </div>

      {/* ฝั่งขวา */}
      <div className="register-right">
        <button className="lang-btn">🌐 EN</button>

        <div className="form-container-box">
          <div className="form-header">
            <h2>Video Summary</h2>
            <h3>Create Account</h3>
            <p className="subtitle">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
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
              {loading ? 'กำลังสมัครสมาชิก...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



