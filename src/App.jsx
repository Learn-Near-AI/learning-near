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

  // Initialize Wallet Selector (Meteor) and keep active account + balance in sync
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
              <div className="w-8 h-8 bg-near-primary rounded-lg flex items-center justify-center">
                <Code2 className="h-5 w-5 text-near-darker" />
              </div>
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
                GitHub
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Theme Toggle, Launch Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-near-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* NEAR Wallet connect – only show in examples view */}
              {currentPath === '/examples' && (
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

              {/* Launch App – hide on examples view */}
              {currentPath !== '/examples' && (
                <button
                  onClick={launchExamplesBrowser}
                  className="hidden md:inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-near-darker bg-near-primary hover:bg-[#00D689] rounded-lg transition-all duration-200"
                >
                  Launch App
                </button>
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
                  GitHub
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
                <button
                  onClick={launchExamplesBrowser}
                  className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-near-darker bg-near-primary hover:bg-[#00D689] rounded-lg transition-all duration-200 mt-2"
                >
                  Launch App
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {currentPath === '/examples' ? (
        <ExamplesBrowser isDark={isDark} toggleTheme={toggleTheme} />
      ) : (
      <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-near-darker dark:via-near-dark dark:to-near-darker pt-16" data-aos="fade-in">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300EC97' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="text-center" data-aos="fade-up" data-aos-delay="100">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="block text-gray-900 dark:text-white">Learn NEAR Smart Contracts</span>
              <span className="block text-near-primary mt-2">by Doing</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              60 interactive examples. Run code in your browser. Deploy to TestNet in one click. AI tutor included.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="300">
              <button
                onClick={launchExamplesBrowser}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-near-darker bg-near-primary hover:bg-[#00D689] rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-near-primary/50"
              >
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:border-near-primary rounded-lg transition-all duration-200"
              >
                View on GitHub
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="relative border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#0B0D1A] backdrop-blur-sm" data-aos="fade-up" data-aos-delay="400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div data-aos="zoom-in" data-aos-delay="100">
                <div className="text-xl sm:text-2xl font-bold text-near-primary">60+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Live Examples</div>
              </div>
              <div data-aos="zoom-in" data-aos-delay="200">
                <div className="text-xl sm:text-2xl font-bold text-near-primary">Zero</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Setup Required</div>
              </div>
              <div data-aos="zoom-in" data-aos-delay="300">
                <div className="text-xl sm:text-2xl font-bold text-near-primary">AI</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Powered Learning</div>
              </div>
              <div data-aos="zoom-in" data-aos-delay="400">
                <div className="text-xl sm:text-2xl font-bold text-near-primary">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Free & Open Source</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-near-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need to Learn</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A complete platform for mastering NEAR smart contract development
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-8 border border-gray-200 dark:border-gray-800 hover:border-near-primary/50 transition-all duration-300 transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-near-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Code2 className="h-8 w-8 text-near-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Interactive Examples</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Write, edit, and run NEAR smart contracts directly in your browser. No installation, no wallet setup needed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-8 border border-gray-200 dark:border-gray-800 hover:border-near-primary/50 transition-all duration-300 transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-near-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-near-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Code Assistant</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Get instant explanations, bug fixes, and code suggestions. Your personal NEAR tutor, available 24/7.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-near-darker rounded-xl p-8 border border-gray-200 dark:border-gray-800 hover:border-near-primary/50 transition-all duration-300 transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="300">
              <div className="w-16 h-16 bg-near-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Rocket className="h-8 w-8 text-near-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">One-Click Deploy</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Deploy your contracts to NEAR TestNet with a single click. See your code running on a real blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-near-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in minutes, master NEAR in hours
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-near-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-near-primary">1</span>
                </div>
                <div className="hidden md:block absolute left-full top-1/2 w-full h-0.5 bg-gradient-to-r from-near-primary/50 to-transparent transform -translate-y-1/2 ml-4"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Choose an Example</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse by difficulty or topic. Find the perfect starting point for your learning journey.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-near-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-near-primary">2</span>
                </div>
                <div className="hidden md:block absolute left-full top-1/2 w-full h-0.5 bg-gradient-to-r from-near-primary/50 to-transparent transform -translate-y-1/2 ml-4"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Learn & Modify</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Read code, ask AI questions, make changes. Experiment freely in a safe environment.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center" data-aos="fade-up" data-aos-delay="300">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-near-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-near-primary">3</span>
                </div>
                <div className="hidden md:block absolute left-full top-1/2 w-full h-0.5 bg-gradient-to-r from-near-primary/50 to-transparent transform -translate-y-1/2 ml-4"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Run in Browser</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Execute instantly with near-workspaces-js. See results immediately, no waiting.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center" data-aos="fade-up" data-aos-delay="400">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-near-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-near-primary">4</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Deploy to TestNet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Push to blockchain when ready. One click, zero hassle, maximum learning.
              </p>
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

      {/* Social Proof Section */}
      <section className="py-20 bg-white dark:bg-near-darker border-t border-gray-200 dark:border-gray-800" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
              "Built for the NEAR community, maintained by the community"
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <a
                href="https://docs.near.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-near-primary hover:text-[#00D689] transition-colors flex items-center gap-2"
              >
                <ExternalLink className="h-5 w-5" />
                <span>docs.near.org integration</span>
              </a>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Github className="h-5 w-5" />
                <span>GitHub Stars </span>
              </div>
              <div className="flex items-center gap-2 text-near-primary">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Official NEAR DevRel Reviewed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-near-dark border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div data-aos="fade-up" data-aos-delay="100">
              <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Documentation</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">Getting Started</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">Examples</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">Tutorials</a></li>
              </ul>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="https://docs.near.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">NEAR Docs</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">Discord</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div data-aos="fade-up" data-aos-delay="400">
              <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">MIT License</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-near-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 NEAR by Example. Open source under MIT License.
            </p>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <span>Made with</span>
              <span className="text-red-500">♥</span>
              <span>for the NEAR community</span>
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

