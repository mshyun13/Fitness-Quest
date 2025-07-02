import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { gsap } from 'gsap'
import bgImage from '/backgrounds/landingpage_bg.png'

const LoginPage = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const navigate = useNavigate()

  // Refs for the elements to animate
  const backgroundRef = useRef(null)
  const titleRef = useRef(null)
  const buttonsContainerRef = useRef(null)

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
          className="mb-8 font-['Real_Tatoem',_serif] text-8xl font-bold text-white drop-shadow-lg"
        >
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
        </div>
      </div>
    </section>
  )
}

export default LoginPage
