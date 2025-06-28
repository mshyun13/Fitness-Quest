import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import Home from './components/Home.tsx'
import Profile from './components/Profile.tsx'
import ActivityLog from './components/ActivityLog.tsx'
import Register from './components/Register.tsx'
import AuthLandingPage from './components/AuthLandingPage.tsx'

export default createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/log" element={<ActivityLog />} />
    <Route path="/register" element={<Register />} />
    <Route path="/auth-landing" element={<AuthLandingPage />} />
    {/* <Route path="/character" element={<Character />} /> */}
  </Route>,
)
