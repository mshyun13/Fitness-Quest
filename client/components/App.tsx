import { Outlet } from 'react-router-dom'
import Nav from './Nav.tsx'

function App() {
  return (
    <>
      <header className="select-none border-b-2 border-green-700 bg-gray-900 p-4 font-mono text-green-300">
        <h1 className="pt-2 text-center font-['Real_Tatoem',_serif] text-6xl text-gray-200">
          Fit Quest
        </h1>
        <Nav />
      </header>
      <main className="h-[87vh] bg-gray-900 text-center text-white">
        <Outlet />
      </main>
    </>
  )
}

export default App
