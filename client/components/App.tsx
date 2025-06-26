// import { useFruits } from '../hooks/useFruits.ts'
import Home from './Home.tsx'
import Profile from './Profile.tsx'
import LoginButton from './LoginButton.tsx'

function App() {
  // const { data } = useFruits()

  return (
    <>
      <div className="app">
        <h1 className="text-3xl font-bold underline">
          Fullstack Boilerplate - with Fruits!
        </h1>
        <LoginButton />
        <Home />
        <Profile />
        {/* <ul>{data && data.map((fruit) => <li key={fruit}>{fruit}</li>)}</ul> */}
      </div>
    </>
  )
}

export default App
