import React, { createContext, useState, useContext } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // 1. ตั้งค่าเริ่มต้นเป็น 'en' (ภาษาอังกฤษ)
  const [lang, setLang] = useState('en');

  // 2. ฟังก์ชันสลับภาษา EN <-> TH
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'th' : 'en'));
  };

  // 3. ดึงคำแปลตามภาษาปัจจุบัน
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom Hook เพื่อให้อื่นๆ ดึงไปใส่ง่ายๆ
export const useLanguage = () => useContext(LanguageContext);