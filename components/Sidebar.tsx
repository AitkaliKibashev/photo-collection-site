'use client'

import { useContext, useState } from 'react'
import { AuthContext } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Settings, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TelegramIcon from './icons/TelegramIcon'
import InstagramIcon from './icons/InstagramIcon'

const Sidebar = () => {
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleAdminClick = () => {
    router.push('/admin')
    setIsMobileMenuOpen(false)
  }

  const sidebarContent = (
    <>
      <div className={'relative h-20 w-20 overflow-hidden rounded-full'}>
        <img
          src="/ava.JPG"
          alt="Nurgaliuly Aitkali"
          className="h-full w-full object-cover"
        />
      </div>
      <p className={'mt-2 text-lg font-bold'}>Nurgaliuly Aitkali</p>
      <p className={'mt-0.5 text-sm leading-5 text-gray-600'}>
        Photographer and frontend developer based in Astana.
      </p>

      {/* Social Media Links */}
      <div className="mt-4 flex gap-3">
        <a
          href="https://t.me/qqibbash"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-900 transition-colors hover:bg-gray-100"
          aria-label="Telegram"
        >
          <TelegramIcon className="h-5 w-5" />
        </a>
        <a
          href="https://www.instagram.com/a.kibashevv/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-900 transition-colors hover:bg-gray-100"
          aria-label="Instagram"
        >
          <InstagramIcon className="h-5 w-5" />
        </a>
      </div>

      {!loading && user && (
        <Button
          onClick={handleAdminClick}
          className="mt-4 flex items-center gap-2"
          variant="outline"
        >
          <Settings className="h-4 w-4" />
          Admin Panel
        </Button>
      )}
    </>
  )

  return (
    <>
      {/* Mobile hamburger button - fixed at bottom */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 shadow-lg transition-transform hover:scale-110 md:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <div
        className={
          'hidden md:fixed md:top-0 md:left-0 md:flex md:h-screen md:w-[300px] md:flex-col md:items-center md:gap-2 md:rounded-tr-2xl md:rounded-br-2xl md:bg-white md:px-5 md:pt-[200px] md:text-center'
        }
      >
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 z-40 flex h-screen w-[280px] flex-col items-center gap-2 bg-white px-5 pt-24 text-center shadow-xl md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
