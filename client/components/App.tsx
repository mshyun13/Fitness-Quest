import { Outlet } from 'react-router'
import Nav from './Nav.tsx'

function App() {
  return (
    <>
      <header>
        <h1 className="text-center text-2xl underline">Fit Quest</h1>
        <Nav />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App
