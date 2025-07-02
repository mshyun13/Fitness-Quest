import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { gsap } from 'gsap'
import bgImage from '/backgrounds/landingpage_bg.png'
import fqLogo from '/logo.webp'

const LoginPage = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const navigate = useNavigate()

  // Refs for the elements to animate
  const backgroundRef = useRef(null)
  const titleRef = useRef(null)
  const buttonsContainerRef = useRef(null)

  const [audio] = useState(() => {
    const sound = new Audio('/audio/fitness3.wav')
    sound.loop = true // Set audio to loop
    return sound
  })
  const [isPlaying, setIsPlaying] = useState(false) // State to control play/pause

  // Effect to play or pause audio based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      audio.play().catch((error) => {
        // Handle potential errors if play() fails (e.g., user hasn't interacted yet, though button click should prevent this)
        console.error('Audio play failed:', error)
      })
    } else {
      audio.pause()
    }
    // No cleanup needed for play/pause, as audio object persists
  }, [isPlaying, audio]) // Dependencies: re-run effect when isPlaying or audio changes

  // Optional: Handle audio ending if not looping (though you set loop=true)
  // This useEffect is still good practice if you ever decide not to loop.
  useEffect(() => {
    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audio])

  // useEffect(() => {
  //   const audio = new Audio('fitness3.wav')
  //   audio.loop = true
  //   audio.play()
  // }, [])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('Authenticated user. Redirecting to /home')
      navigate('/home')
    }
  }, [isAuthenticated, isLoading, navigate])

  // GSAP timeline animation
  useEffect(() => {
    if (!isLoading) {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      // Start zoomed in
      gsap.set(backgroundRef.current, {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: '250% 250%', // Zoomed in
        backgroundPosition: '50% 10%',
      })

      // Hide title and buttons
      gsap.set(titleRef.current, { autoAlpha: 0, y: 50 }) // start position y:50
      gsap.set(buttonsContainerRef.current, { autoAlpha: 0, y: 50 })

      // Zoom out
      tl.to(backgroundRef.current, {
        backgroundSize: '100% 100%',
        backgroundPosition: 'center center',
        duration: 5,
        ease: 'power1.inOut',
      })

      // Animate 'Fit Quest'
      tl.to(
        titleRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'back.out(1.7)',
        },
        '-=3',
      )

      // Animate Login/Register buttons
      tl.to(
        buttonsContainerRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
        },
        '-=1',
      )
    }
  }, [isLoading])

  const handleLogin = () => {
    loginWithRedirect()
  }

  const handleRegister = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
      },
    })
  }

  const handleToggleMusic = () => {
    setIsPlaying((prev) => !prev) // Toggle the playing state
  }

  if (isLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-900 text-green-300">
        <h1>Loading...</h1>
      </section>
    )
  }

  return (
    <section
      ref={backgroundRef}
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-fixed bg-no-repeat font-mono text-green-300"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-4xl text-center">
        <h1
          ref={titleRef}
          className="mb-8 flex flex-wrap items-center justify-center font-['Real_Tatoem',_serif] text-8xl font-bold text-white drop-shadow-lg"
        >
          <div>
            <img
              src={fqLogo}
              alt="Fit Quest Logo"
              className="mr-4 h-32 w-auto self-center"
            />
          </div>
          Fit Quest
        </h1>
        <div ref={buttonsContainerRef} className="mx-auto my-4 max-w-md p-8">
          {/* Login Button */}
          <div className="mb-4">
            <button
              className="w-full rounded-xl border-2 bg-white/30 px-6 py-3 text-2xl font-bold text-white transition-all duration-300 hover:backdrop-blur-sm"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>

          {/* Register Button */}
          {/* <div>
            <button
              className="w-full rounded border border-transparent bg-transparent px-6 py-3 text-2xl font-bold text-white transition-all duration-300 hover:border-blue-500 hover:text-blue-300"
              onClick={handleRegister}
            >
              Register
            </button>
          </div> */}
        </div>
      </div>
      <div className="absolute bottom-0 mb-4">
        <button
          className="w-full rounded-xl border-2 bg-white/30 px-6 py-3 text-xl font-bold text-white transition-all duration-300 hover:backdrop-blur-sm"
          onClick={handleToggleMusic}
        >
          {isPlaying ? 'Music ⏸️' : 'Music ▶️'}
        </button>
      </div>
    </section>
  )
}

export default LoginPage
