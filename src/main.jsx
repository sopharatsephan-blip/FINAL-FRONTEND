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
import StudentDashboard from './student/StudentDashboard.jsx';
import { LanguageProvider } from './LanguageContext.jsx'; 
import CoopContent  from './student/CoopContent.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/upload-video" element={<UploadVideo />} />
          <Route path="/summary-result" element={<SummaryResult />} />
          <Route path="/summary-detail" element={<SummaryDetail />} />
          <Route path="/edit-summary" element={<EditList />} />
          <Route path="/edit-summary-detail" element={<EditSummary />} />
          <Route path="/publish" element={<PublishList />} />
          <Route path="/publish-summary" element={<PublishSummary />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          {/* ✅ แก้ไข path ให้มีเครื่องหมาย / และตรงกับลิงก์ในหน้าเว็บ */}
          <Route path="/coop-content" element={<CoopContent />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider> 
  </React.StrictMode>
);