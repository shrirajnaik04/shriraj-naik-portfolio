"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Linkedin, Github, Send, Loader } from "lucide-react"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  })
  const [focused, setFocused] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  })

  // Auto-hide success/error messages after 5 seconds
  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      setShowMessage(true)
      const timer = setTimeout(() => {
        setShowMessage(false)
        setTimeout(() => {
          setSubmitStatus('idle')
          setErrorMessage('')
        }, 500) // Wait for exit animation to complete
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [submitStatus])

  // Validation functions
  const validateName = (name: string): string => {
    if (!name.trim()) return 'Full name is required.'
    if (name.trim().length < 2) return 'Name must be at least 2 characters.'
    if (name.trim().length > 50) return 'Name must be less than 50 characters.'
    if (!/^[a-zA-Z\s.'-]+$/.test(name.trim())) return 'Name can only contain letters, spaces, dots, hyphens, and apostrophes.'
    return ''
  }

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email address is required.'
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address.'
    if (email.length > 100) return 'Email must be less than 100 characters.'
    return ''
  }

  const validateSubject = (subject: string): string => {
    if (!subject.trim()) return 'Subject is required.'
    if (subject.trim().length < 5) return 'Subject must be at least 5 characters.'
    if (subject.trim().length > 100) return 'Subject must be less than 100 characters.'
    return ''
  }

  const validateMessage = (message: string): string => {
    if (!message.trim()) return 'Message is required.'
    if (message.trim().length < 10) return 'Message must be at least 10 characters.'
    if (message.trim().length > 1000) return 'Message must be less than 1000 characters.'
    return ''
  }

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name': return validateName(value)
      case 'email': return validateEmail(value)
      case 'subject': return validateSubject(value)
      case 'message': return validateMessage(value)
      default: return ''
    }
  }

  const validateForm = (): boolean => {
    const errors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      subject: validateSubject(formData.subject),
      message: validateMessage(formData.message)
    }
    
    setValidationErrors(errors)
    return !Object.values(errors).some(error => error !== '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true
    })

    // Validate the entire form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      console.log('Email sent successfully:', data)
      setSubmitStatus('success')
      setFormData({ name: "", email: "", subject: "", message: "" })
      setValidationErrors({ name: '', email: '', subject: '', message: '' })
      setTouched({ name: false, email: false, subject: false, message: false })
      setFocused({ name: false, email: false, subject: false, message: false })
      
    } catch (error) {
      console.error('Failed to send email:', error)
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Validate field on change if it's been touched
    if (touched[name as keyof typeof touched]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    setFocused(prev => ({
      ...prev,
      [name]: false
    }))

    setValidationErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }))
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    
    setFocused(prev => ({
      ...prev,
      [name]: true
    }))
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-teal-400" />,
      label: "Email",
      value: "nykshriraj4nov@gmail.com",
      href: "mailto:nykshriraj4nov@gmail.com",
    },
    {
      icon: <Phone className="w-6 h-6 text-purple-400" />,
      label: "Phone",
      value: "+91 9764904641",
      href: "tel:+919764904641",
    },
    {
      icon: <MapPin className="w-6 h-6 text-teal-400" />,
      label: "Location",
      value: "Goa, India",
      href: "#",
    },
  ]

  const socialLinks = [
    {
      icon: <Linkedin className="w-6 h-6" />,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/shriraj-naik-494421154/",
      color: "hover:text-blue-400",
    },
    {
      icon: <Github className="w-6 h-6" />,
      label: "GitHub",
      href: "https://github.com/shrirajnaik04",
      color: "hover:text-gray-400",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      href: "mailto:nykshriraj4nov@gmail.com",
      color: "hover:text-teal-400",
    },
  ]

  return (
    <section id="contact" className="py-20 bg-slate-950 min-h-screen viewport-stable">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
              Let's Work Together
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Ready to transform your QA processes with cutting-edge automation and AI? Let's discuss your project.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16"
             style={{ minHeight: 'calc(100vh - 12rem)' }}>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 lg:space-y-8"
          >
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">Get In Touch</h3>
              <p className="text-slate-400 text-base lg:text-lg leading-relaxed mb-6 lg:mb-8">
                I'm always interested in discussing new opportunities, innovative projects, and ways to help businesses
                achieve their QA and AI goals.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 lg:space-y-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-teal-500/50 transition-all duration-300 group"
                >
                  <div className="p-2 bg-slate-700 rounded-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <div className="text-xs lg:text-sm text-slate-400">{info.label}</div>
                    <div className="text-white font-medium text-sm lg:text-base">{info.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-base lg:text-lg font-semibold text-white mb-4">Connect With Me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 lg:p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-teal-500/50 text-slate-400 ${social.color} transition-all duration-300`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            id="contact-form"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 lg:p-8 rounded-2xl border border-slate-700"
            style={{ 
              position: 'relative',
              minHeight: 'fit-content',
              transform: 'translateZ(0)' // Force hardware acceleration
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6"
                  style={{ 
                    position: 'relative',
                    zIndex: 1
                  }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{
                      WebkitBoxShadow: '0 0 0px 1000px rgb(51 65 85 / var(--tw-bg-opacity, 0.5)) inset',
                      WebkitTextFillColor: '#ffffff',
                      backgroundColor: 'rgb(51 65 85 / 0.5)',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                    }}
                    className={`w-full bg-slate-700/50 border rounded-lg px-4 py-4 text-white focus:outline-none focus:ring-2 transition-all duration-300 text-sm lg:text-base ${
                      validationErrors.name && touched.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-600 focus:border-teal-500 focus:ring-teal-500/20'
                    }`}
                    placeholder=""
                  />
                  <label 
                    className={`absolute left-3 px-2 font-medium transition-all duration-300 pointer-events-none ${
                      formData.name || focused.name 
                        ? '-top-2 text-xs text-teal-400 bg-slate-800' 
                        : 'top-4 text-sm lg:text-base text-slate-400'
                    }`}
                  >
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  {validationErrors.name && touched.name && (
                    <p className="mt-1 text-xs text-red-400">{validationErrors.name}</p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{
                      WebkitBoxShadow: '0 0 0px 1000px rgb(51 65 85 / var(--tw-bg-opacity, 0.5)) inset',
                      WebkitTextFillColor: '#ffffff',
                      backgroundColor: 'rgb(51 65 85 / 0.5)',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                    }}
                    className={`w-full bg-slate-700/50 border rounded-lg px-4 py-4 text-white focus:outline-none focus:ring-2 transition-all duration-300 text-sm lg:text-base ${
                      validationErrors.email && touched.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-600 focus:border-teal-500 focus:ring-teal-500/20'
                    }`}
                    placeholder=""
                  />
                  <label 
                    className={`absolute left-3 px-2 font-medium transition-all duration-300 pointer-events-none ${
                      formData.email || focused.email 
                        ? '-top-2 text-xs text-teal-400 bg-slate-800' 
                        : 'top-4 text-sm lg:text-base text-slate-400'
                    }`}
                  >
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  {validationErrors.email && touched.email && (
                    <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{
                    WebkitBoxShadow: '0 0 0px 1000px rgb(51 65 85 / var(--tw-bg-opacity, 0.5)) inset',
                    WebkitTextFillColor: '#ffffff',
                    backgroundColor: 'rgb(51 65 85 / 0.5)',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                  }}
                  className={`w-full bg-slate-700/50 border rounded-lg px-4 py-4 text-white focus:outline-none focus:ring-2 transition-all duration-300 text-sm lg:text-base ${
                    validationErrors.subject && touched.subject
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-600 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                  placeholder=""
                />
                <label 
                  className={`absolute left-3 px-2 font-medium transition-all duration-300 pointer-events-none ${
                    formData.subject || focused.subject 
                      ? '-top-2 text-xs text-teal-400 bg-slate-800' 
                      : 'top-4 text-sm lg:text-base text-slate-400'
                  }`}
                >
                  Subject <span className="text-red-400">*</span>
                </label>
                {validationErrors.subject && touched.subject && (
                  <p className="mt-1 text-xs text-red-400">{validationErrors.subject}</p>
                )}
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{
                    WebkitBoxShadow: '0 0 0px 1000px rgb(51 65 85 / var(--tw-bg-opacity, 0.5)) inset',
                    WebkitTextFillColor: '#ffffff',
                    backgroundColor: 'rgb(51 65 85 / 0.5)',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                  }}
                  rows={5}
                  className={`w-full bg-slate-700/50 border rounded-lg px-4 py-4 text-white focus:outline-none focus:ring-2 transition-all duration-300 resize-none text-sm lg:text-base ${
                    validationErrors.message && touched.message
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-600 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                  placeholder=""
                />
                <label 
                  className={`absolute left-3 px-2 font-medium transition-all duration-300 pointer-events-none ${
                    formData.message || focused.message 
                      ? '-top-2 text-xs text-teal-400 bg-slate-800' 
                      : 'top-4 text-sm lg:text-base text-slate-400'
                  }`}
                >
                  Message <span className="text-red-400">*</span>
                </label>
                <div className="flex justify-between items-center mt-1">
                  {validationErrors.message && touched.message ? (
                    <p className="text-xs text-red-400">{validationErrors.message}</p>
                  ) : (
                    <div></div>
                  )}
                  <p className={`text-xs ${
                    formData.message.length > 1000 ? 'text-red-400' : 
                    formData.message.length > 800 ? 'text-yellow-400' : 'text-slate-500'
                  }`}>
                    {formData.message.length}/1000
                  </p>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-teal-500 to-purple-600 px-6 py-3 lg:px-8 lg:py-4 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>

              {/* Status Messages */}
              {(submitStatus === 'success' || submitStatus === 'error') && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ 
                    opacity: showMessage ? 1 : 0, 
                    y: showMessage ? 0 : 20, 
                    scale: showMessage ? 1 : 0.95 
                  }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.4, 0, 0.2, 1],
                    opacity: { duration: showMessage ? 0.3 : 0.5 }
                  }}
                  className={`relative overflow-hidden p-4 rounded-lg text-center text-sm lg:text-base ${
                    submitStatus === 'success'
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : 'bg-red-500/20 border border-red-500/50 text-red-400'
                  }`}
                >
                  {/* Background shimmer effect */}
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ 
                      duration: 2, 
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatDelay: 3 
                    }}
                    className={`absolute inset-0 ${
                      submitStatus === 'success'
                        ? 'bg-gradient-to-r from-transparent via-green-400/10 to-transparent'
                        : 'bg-gradient-to-r from-transparent via-red-400/10 to-transparent'
                    }`}
                  />
                  
                  {/* Progress bar */}
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: showMessage ? '0%' : '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className={`absolute bottom-0 left-0 h-1 ${
                      submitStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  
                  {/* Message content */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="relative z-10 flex items-center justify-center space-x-2"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5, type: 'spring', bounce: 0.6 }}
                      className="text-lg"
                    >
                      {submitStatus === 'success' ? '✅' : '❌'}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      {submitStatus === 'success' 
                        ? "Message sent successfully! I'll get back to you soon."
                        : (errorMessage || 'Failed to send message. Please try again or email me directly.')
                      }
                    </motion.span>
                  </motion.div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
