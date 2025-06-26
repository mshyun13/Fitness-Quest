import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import Home from './components/Home.tsx'
import Profile from './components/Profile.tsx'

export default createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="/profile" element={<Profile />} />
    {/* <Route path="/log" element={<ActivityLog />} />
    <Route path="/login" element={<Login />} />
    <Route path="/character" element={<Character />} /> */}
  </Route>,
)
