import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import เพจต่าง ๆ
import Home from './Home.jsx';
import Login from './Login.jsx';
import AdminDashboard from './admindashboard.jsx';
import UploadVideo from './UploadVideo.jsx';
import SummaryResult from './SummaryResult.jsx';
import SummaryDetail from './SummaryDetail.jsx';
import EditList from './EditList.jsx';
import EditSummary from './EditSummary.jsx';
import PublishList from './PublishList.jsx';
import PublishSummary from './PublishSummary.jsx';
import UserManagement from './UserManagement.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/upload-video" element={<UploadVideo />} />
        <Route path="/summary-result" element={<SummaryResult />} />
        <Route path="/summary-detail" element={<SummaryDetail />} />
        
        {/* 🟢 ส่วนแก้ไขข้อมูลสรุป (หน้ารายการการ์ด -> หน้าแก้ไขตัวเต็ม) */}
        <Route path="/edit-summary" element={<EditList />} />
        <Route path="/edit-summary-detail" element={<EditSummary />} />
        
        {/* 🟢 ส่วนเผยแพร่สรุปเนื้อหา (หน้ารายการการ์ด -> หน้าพร้อมเผยแพร่ตัวเต็ม) */}
        <Route path="/publish" element={<PublishList />} />
        <Route path="/publish-summary" element={<PublishSummary />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);