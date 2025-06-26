import { Link } from 'react-router-dom'
import LoginButton from './LoginButton'

export default function Nav() {
  return (
    <div className="flex justify-around">
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/log">Activity Log</Link>
      <LoginButton />
    </div>
  )
}
