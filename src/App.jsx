import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import OTP from './pages/OTP.jsx'
import Home from './pages/Home.jsx'
import Play from './pages/Play.jsx'
import Rewards from './pages/Rewards.jsx'
import { useAppSelector } from './store/hooks.js'

function AppRoutes() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OTP />} />
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/play"
        element={isAuthenticated ? <Play /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/rewards"
        element={isAuthenticated ? <Rewards /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
