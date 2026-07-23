import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom"; // นำเข้า BrowserRouter เพิ่มเติม
import Home from "./Home";
import Login from "./Login";
import './index.css';

function App() {
  return (
    <Routes>
      {/* กำหนดให้หน้า Home เป็นหน้าแรกสุดเมื่อเข้าเว็บ */}
      <Route path="/" element={<Home />} />
      
      {/* หน้า Login */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* ครอบ App ตรงนี้ */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);