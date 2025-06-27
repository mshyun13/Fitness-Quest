import { Link } from 'react-router-dom'
import LoginButton from './LoginButton'

export default function Nav() {
  return (
    <div className="flex flex-wrap justify-around sm:text-xl">
      <Link to="/">Home</Link>
      <p>-</p>
      <Link to="/profile">Profile</Link>
      <p>-</p>
      <Link to="/log">Activity Log</Link>
      <p>-</p>
      <LoginButton />
    </div>
  )
}
