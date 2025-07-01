import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import Home from './components/Home.tsx'
import Profile from './components/Profile.tsx'
import ActivityLog from './components/ActivityLog.tsx'
import Register from './components/Register.tsx'
import AuthLandingPage from './components/AuthLandingPage.tsx'
import LoginPage from './components/LandingPage.tsx'
import Leaderboard from './components/Leaderboard.tsx'
import Feed from './components/Feed.tsx'
import Tutorial from './components/Tutorial.tsx'

export default createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<LoginPage />} />
    <Route path="/home" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/log" element={<ActivityLog />} />
    <Route path="/register" element={<Register />} />
    <Route path="/auth-landing" element={<AuthLandingPage />} />
    <Route path="/leaderboard" element={<Leaderboard />} />
    <Route path="/feed" element={<Feed />} />
    <Route path="/tutorial" element={<Tutorial />} />
    {/* <Route path="/character" element={<Character />} /> */}
  </Route>,
)
