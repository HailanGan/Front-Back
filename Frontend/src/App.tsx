import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import EmailSent from "./pages/EmailSent";
import PasswordResetPage from "./pages/Reset";
import ResetSucessPage from "./pages/ResetSucess";
import DashboardPage from "./pages/Dashboard";
import Main from "./apps/ai-assistant/pages/main";
import PasswordSection from "./pages/PasswordSection";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/Profile";
import Assistant from './apps/ai-assistant/components/chat';
//import NotFound from "./pages/NotFound";
//import { useAuth } from "./hooks/useAuth";
//import Header from "./components/Header";
//import Footer from "./components/Footer";

const App: React.FC = () => {

  return (
    <Router>
      {/* 全局布局 - 导航栏 */}

      {/* 路由配置 */}
      <Routes>

        {/* 登录页面 */}
        <Route path="/" element={<Login />} />
        {/* 忘记密码 */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* 邮箱提交成功 */}
        <Route path="/success" element={<EmailSent />} />
        {/* 添加密码重置页面的路由 */}
        <Route path="/reset-password" element={<PasswordResetPage />} />
        {/* 密码重置成功页面的路由 */}
        <Route path="/reset-success" element={<ResetSucessPage />} />
         {/* 登录成功后Dashboard */}
        <Route path="/Dashboard" element={<DashboardPage />} />

        <Route path="/Profile" element={<ProfilePage />} />

        <Route path="/Changepassword" element={<PasswordSection />} />

        <Route path="/chat" element={<Assistant />} />

      </Routes>
      {/* 全局布局 - 页脚 */}
    </Router>
  );
};

export default App;
