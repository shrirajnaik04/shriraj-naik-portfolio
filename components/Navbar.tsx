"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      // Close mobile menu when scrolling
      if (isOpen) {
        setIsOpen(false)
      }
    }

    // Add padding to body to prevent overlap - reduced for mobile
    const isMobile = window.innerWidth < 768
    document.body.style.paddingTop = isMobile ? "60px" : "70px"

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.body.style.paddingTop = "0"
    }
  }, [isOpen])

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Tech Stack", href: "#tech" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      aria-label="Primary"
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled ? "bg-slate-900/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          <motion.a
            href="#home"
            whileHover={{ scale: 1.05 }}
            className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent rounded-md"
            aria-label="Shriraj Naik — back to top"
          >
            Shriraj Naik
          </motion.a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.name}>
                <motion.a
                  href={item.href}
                  whileHover={{ scale: 1.1 }}
                  className="text-slate-300 hover:text-teal-400 transition-colors duration-200 font-medium rounded-md px-1"
                >
                  {item.name}
                </motion.a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-teal-400 p-2 rounded-md"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.ul
            id="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-800 rounded-lg mt-2 p-4 list-none"
          >
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="block py-2 text-slate-300 hover:text-teal-400 transition-colors duration-200 font-medium rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.nav>
  )
}
