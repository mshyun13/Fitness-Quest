import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <div className="flex justify-around">
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/log">Activity Log</Link>
      <Link to="/login">Login</Link>
    </div>
  )
}
