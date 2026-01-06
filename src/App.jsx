import React, { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { 
  Code2, 
  Sparkles, 
  Rocket, 
  Target, 
  Coins, 
  Link2, 
  Shield, 
  Database, 
  Gamepad2,
  Github,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  LogOut
} from 'lucide-react'
import ExamplesBrowser from './components/ExamplesBrowser'
import SuccessPage from './components/SuccessPage'
import {
  initWalletSelector,
  openWalletSelectorModal,
  getActiveAccountId,
  getActiveAccountBalance,
  disconnectWallet,
} from './near/near'

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or default to dark mode
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })
  const [walletAccountId, setWalletAccountId] = useState(null)
  const [walletBalance, setWalletBalance] = useState(null)
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    })

    // Apply theme
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  // Initialize Wallet Selector (MyNearWallet) and keep active account + balance in sync
  useEffect(() => {
    ;(async () => {
      try {
        await initWalletSelector()

        const updateAccountState = async () => {
          const accountId = await getActiveAccountId()
          if (!accountId) {
            setWalletAccountId(null)
            setWalletBalance(null)
            return
          }
          setWalletAccountId(accountId)
          const balance = await getActiveAccountBalance()
          if (balance !== null) {
            setWalletBalance(balance)
          }
        }

        // Initial fetch
        await updateAccountState()
        // Poll periodically so state updates after user connects via modal
        const intervalId = setInterval(updateAccountState, 5000)
        return () => clearInterval(intervalId)
      } catch (e) {
        console.error('Failed to init wallet selector', e)
      }
    })()
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Close wallet dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (walletDropdownOpen && !event.target.closest('.wallet-dropdown-container')) {
        setWalletDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [walletDropdownOpen])

  const navigate = (path) => {
    if (path === currentPath) return
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const scrollToTop = () => {
    if (currentPath !== '/') {
      navigate('/')
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const launchExamplesBrowser = () => {
    navigate('/examples')
  }

  const handleWalletConnect = async () => {
    await initWalletSelector()
    openWalletSelectorModal()
  }

  const handleWalletDisconnect = async () => {
    await disconnectWallet()
    setWalletAccountId(null)
    setWalletBalance(null)
    setWalletDropdownOpen(false)
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-near-darker/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              onClick={scrollToTop}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <img 
                src="/assets/images/vecteezy.png" 
                alt="NEAR Logo" 
                className="w-8 h-8 object-contain rotate-slow"
              />
              <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-near-primary transition-colors">
                NEAR by Example
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={launchExamplesBrowser}
                className="text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors font-medium"
              >
                Examples
              </button>
              <a
                href="https://docs.near.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors font-medium"
              >
                Docs
              </a>
              <a
                href="#"
                className="text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors font-medium"
              >
                Community
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors font-medium flex items-center gap-1"
              >
                Learn
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Theme Toggle, Wallet, Login/Sign Up Buttons & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="hidden md:block p-2 text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* NEAR Wallet connect – only show in examples view */}
              {currentPath.startsWith('/examples') && (
                <div className="hidden md:block relative wallet-dropdown-container">
                  {walletAccountId ? (
                    <>
                      <button
                        onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-near-dark text-gray-800 dark:text-gray-100 hover:border-near-primary hover:text-near-primary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-left">
                            <div className="font-mono text-xs text-gray-600 dark:text-gray-400">
                              {walletAccountId}
                            </div>
                            <div className="text-xs font-semibold text-near-primary">
                              {walletBalance ? `${walletBalance} Ⓝ` : 'Loading…'}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${walletDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {walletDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-near-dark rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account</div>
                            <div className="font-mono text-sm text-gray-900 dark:text-white break-all">
                              {walletAccountId}
                            </div>
                          </div>
                          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Balance</div>
                            <div className="text-lg font-semibold text-near-primary">
                              {walletBalance ? `${walletBalance} Ⓝ` : 'Loading…'}
                            </div>
                          </div>
                          <div className="p-2">
                            <button
                              onClick={handleWalletDisconnect}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              Disconnect Wallet
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={handleWalletConnect}
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:border-near-primary hover:text-near-primary transition-colors"
                    >
                      Connect NEAR Wallet
                    </button>
                  )}
                </div>
              )}

              {/* Login & Sign Up Buttons – Finpay style */}
              {!currentPath.startsWith('/examples') && (
                <div className="hidden md:flex items-center gap-3">
                  
                  <button
                    onClick={launchExamplesBrowser}
                    className="px-4 py-2 text-sm font-semibold text-white bg-near-primary hover:bg-[#00D689] rounded-lg transition-all duration-200"
                  >
                    Get Started
                  </button>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
              <div className="flex flex-col gap-4">
                <button
                  onClick={launchExamplesBrowser}
                  className="text-left text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors font-medium py-2"
                >
                  Examples
                </button>
                <a
                  href="https://docs.near.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors font-medium py-2"
                >
                  Docs
                </a>
                <a
                  href="#"
                  className="text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors font-medium py-2"
                >
                  Community
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors font-medium py-2 flex items-center gap-1"
                >
                  Learn
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={toggleTheme}
                  className="text-left text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors font-medium py-2 flex items-center gap-2"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-5 w-5" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5" />
                      Dark Mode
                    </>
                  )}
                </button>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={launchExamplesBrowser}
                    className="flex-1 px-4 py-2 text-sm font-medium text-near-primary bg-white dark:bg-transparent border border-near-primary/30 rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={launchExamplesBrowser}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-near-primary hover:bg-[#00D689] rounded-lg"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {currentPath.startsWith('/examples') ? (
        <ExamplesBrowser isDark={isDark} toggleTheme={toggleTheme} />
      ) : (
      <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-near-darker pt-16" data-aos="fade-in">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Half - Text Content */}
            <div className="text-left" data-aos="fade-up" data-aos-delay="100">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
                Learn NEAR Smart Contracts by Doing
              </h1>
              
              <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl" data-aos="fade-up" data-aos-delay="200">
                60 interactive examples. Run code in your browser. Deploy to TestNet in one click. AI tutor included.
              </p>
              
              {/* Email Input & Get Started Button */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg" data-aos="fade-up" data-aos-delay="300">
                <input
                  type="email"
                  placeholder="Your Account Addr"
                  className="flex-1 px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-near-dark text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-near-primary focus:border-transparent"
                />
                <button
                  onClick={launchExamplesBrowser}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-near-primary hover:bg-[#00D689] rounded-lg transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>

              {/* Partner/Community Logos */}
              <div className="mt-8 flex items-center gap-6 text-gray-500 dark:text-gray-400 text-sm" data-aos="fade-up" data-aos-delay="400">
                <span className="text-gray-400 dark:text-gray-500">Trusted by:</span>
                <div className="flex items-center gap-4">
                  <span className="font-medium">NEAR Protocol</span>
                  <span className="font-medium">GitHub</span>
                  <span className="font-medium">Community</span>
                </div>
              </div>
            </div>

            {/* Right Half - Visual Element */}
            <div className="flex items-center justify-center" data-aos="fade-up" data-aos-delay="200">
              <div className="relative w-full max-w-md">
                <div className="bg-gradient-to-br from-near-primary/10 to-near-primary/5 rounded-2xl p-8 border border-near-primary/20">
                  <div className="bg-white dark:bg-near-dark rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-near-primary/10 rounded-full flex items-center justify-center">
                        <Code2 className="h-5 w-5 text-near-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">NEAR by Example</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">learn-near.com</div>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Example</div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">60+</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Interactive Examples</div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2 mb-3">
                        <button className="flex-1 px-3 py-2 text-sm font-medium bg-near-primary text-white rounded-lg">
                          Run Code
                        </button>
                        <button className="flex-1 px-3 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
                          Deploy
                        </button>
                      </div>
                      <button className="w-full px-4 py-2 text-sm font-semibold bg-near-primary hover:bg-[#00D689] text-white rounded-lg transition-colors">
                        Start Learning
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Future Payment Style */}
      <section className="py-20 bg-gray-50 dark:bg-near-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
            <div data-aos="fade-up">
              <div className="text-xs font-semibold text-near-primary uppercase tracking-wider mb-4">
                LEARNING PLATFORM
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Experience that grows with your scale.
              </h2>
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Design a learning system that works for your skill level and streamlines smart contract development.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-8 border border-gray-200 dark:border-gray-800 hover:border-near-primary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
              <div className="w-12 h-12 bg-near-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Code2 className="h-6 w-6 text-near-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Interactive Examples</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                Write, edit, and run NEAR smart contracts directly in your browser. No installation, no wallet setup needed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-8 border border-gray-200 dark:border-gray-800 hover:border-near-primary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
              <div className="w-12 h-12 bg-near-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-near-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">AI Code Assistant</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                Get instant explanations, bug fixes, and code suggestions. Your personal NEAR tutor, available 24/7.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-8 border border-gray-200 dark:border-gray-800 hover:border-near-primary/50 transition-all duration-300" data-aos="fade-up" data-aos-delay="400">
              <div className="w-12 h-12 bg-near-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Rocket className="h-6 w-6 text-near-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">One-Click Deploy</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                Deploy your contracts to NEAR TestNet with a single click. See your code running on a real blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why They Prefer Section */}
      <section className="py-20 bg-gray-50 dark:bg-near-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12" data-aos="fade-up">
            <div className="text-xs font-semibold text-near-primary uppercase tracking-wider mb-4">
              WHY US
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Why they prefer NEAR by Example.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 - Stats */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-6 border border-gray-200 dark:border-gray-800" data-aos="fade-up" data-aos-delay="100">
              <div className="text-4xl font-bold text-near-primary mb-2">60+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Live Examples</div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Interactive smart contract examples ready to learn</p>
            </div>

            {/* Card 2 - Instant Access */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-6 border border-gray-200 dark:border-gray-800" data-aos="fade-up" data-aos-delay="200">
              <div className="w-10 h-10 bg-near-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-5 w-5 text-near-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Instant Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Run code in your browser instantly, no setup required.</p>
            </div>

            {/* Card 3 - No Setup */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-6 border border-gray-200 dark:border-gray-800" data-aos="fade-up" data-aos-delay="300">
              <div className="w-10 h-10 bg-near-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="h-5 w-5 text-near-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Zero Setup</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Start learning immediately without any installation or configuration.</p>
            </div>

            {/* Card 4 - Summary/Stats */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-6 border border-gray-200 dark:border-gray-800" data-aos="fade-up" data-aos-delay="400">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Summary</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">100%</div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-near-primary rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Free & Open Source</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Maximize Returns Style */}
      <section className="py-20 bg-near-darker dark:bg-near-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12" data-aos="fade-up">
            <div className="text-xs font-semibold text-near-primary uppercase tracking-wider mb-4">
              STEP
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Maximize your learning with a platform that grows.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/5 rounded-xl p-8 border border-white/10" data-aos="fade-up" data-aos-delay="100">
              <div className="text-2xl font-bold text-near-primary mb-4">1</div>
              <h3 className="text-xl font-bold mb-3">Open your account</h3>
              <p className="text-gray-300 leading-relaxed">
                Sign up to NEAR by Example and set up your learning environment from the dashboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 rounded-xl p-8 border border-white/10" data-aos="fade-up" data-aos-delay="200">
              <div className="text-2xl font-bold text-near-primary mb-4">2</div>
              <h3 className="text-xl font-bold mb-3">Start learning</h3>
              <p className="text-gray-300 leading-relaxed">
                Choose an example and start coding. Run code in your browser and see results instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 rounded-xl p-8 border border-white/10" data-aos="fade-up" data-aos-delay="300">
              <div className="text-2xl font-bold text-near-primary mb-4">3</div>
              <h3 className="text-xl font-bold mb-3">Deploy to TestNet</h3>
              <p className="text-gray-300 leading-relaxed">
                Deploy your contracts when ready. One click deployment to NEAR TestNet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-white dark:bg-near-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12" data-aos="fade-up">
            <div className="text-xs font-semibold text-near-primary uppercase tracking-wider mb-4">
              OUR MISSION
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              We've helped innovative developers.
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Hundreds of developers of all skill levels and across all industries have made big improvements with us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-near-dark rounded-xl p-8" data-aos="fade-up" data-aos-delay="100">
              <div className="text-4xl font-bold text-near-primary mb-2">60+</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Interactive Examples</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ready to learn from</p>
            </div>
            <div className="bg-gray-50 dark:bg-near-dark rounded-xl p-8" data-aos="fade-up" data-aos-delay="200">
              <div className="text-4xl font-bold text-near-primary mb-2">100%</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Free & Open Source</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">No cost to learn</p>
            </div>
            <div className="bg-gray-50 dark:bg-near-dark rounded-xl p-8" data-aos="fade-up" data-aos-delay="300">
              <div className="text-4xl font-bold text-near-primary mb-2">24/7</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">AI Tutor Available</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Learn anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Categories Preview */}
      <section id="examples" className="py-20 bg-gray-50 dark:bg-near-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explore by Category</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From basics to advanced, find examples that match your skill level
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category 1 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="100">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-near-primary mr-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Basics</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Storage, State, Methods - Master the fundamentals of NEAR smart contracts
              </p>
            </div>

            {/* Category 2 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="200">
              <div className="flex items-center mb-4">
                <Coins className="h-8 w-8 text-near-primary mr-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tokens</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                FT, NFT Standards - Learn token standards and implementations
              </p>
            </div>

            {/* Category 3 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="300">
              <div className="flex items-center mb-4">
                <Link2 className="h-8 w-8 text-near-primary mr-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cross-Contract Calls</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Learn how contracts interact with each other on NEAR
              </p>
            </div>

            {/* Category 4 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="400">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-near-primary mr-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Chain Signatures</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Understand authentication and security on NEAR blockchain
              </p>
            </div>

            {/* Category 5 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="500">
              <div className="flex items-center mb-4">
                <Database className="h-8 w-8 text-near-primary mr-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Data & Indexing</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Explore data structures and indexing patterns for NEAR contracts
              </p>
            </div>

            {/* Category 6 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-near-primary transition-all duration-300 cursor-pointer group" data-aos="zoom-in" data-aos-delay="600">
              <div className="flex items-center mb-4">
                <Gamepad2 className="h-8 w-8 text-near-primary mr-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Real-World Apps</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                See complete applications built on NEAR protocol
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-near-darker border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo */}
            <div data-aos="fade-up" data-aos-delay="100">
              <div 
                onClick={scrollToTop}
                className="flex items-center gap-2 cursor-pointer group mb-4"
              >
                <img 
                  src="/assets/images/vecteezy.png" 
                  alt="NEAR Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-near-primary transition-colors">
                  NEAR by Example
                </span>
              </div>
            </div>

            {/* Solutions Column */}
            <div data-aos="fade-up" data-aos-delay="200">
              <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-4">Solutions</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Getting Started</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Examples</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Tutorials</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Templates</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div data-aos="fade-up" data-aos-delay="300">
              <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Career</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Learn Column */}
            <div data-aos="fade-up" data-aos-delay="400">
              <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-4">Learn</h4>
              <ul className="space-y-2">
                <li><a href="https://docs.near.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">NEAR Docs</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Guides</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors text-sm">Ebooks</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 NEAR by Example. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">
                <ExternalLink className="h-5 w-5" />
              </a>
              
            </div>
          </div>
        </div>
      </footer>
      </>
      )}
    </div>
  )
}

export default App

