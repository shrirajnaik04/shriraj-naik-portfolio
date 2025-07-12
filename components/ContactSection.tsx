"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { Mail, Phone, MapPin, Linkedin, Github, Send, Loader } from "lucide-react"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setFormData({ name: "", email: "", subject: "", message: "" })
    alert("Message sent successfully!")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-teal-400" />,
      label: "Email",
      value: "shriraj.naik@example.com",
      href: "mailto:shriraj.naik@example.com",
    },
    {
      icon: <Phone className="w-6 h-6 text-purple-400" />,
      label: "Phone",
      value: "+91 98765 43210",
      href: "tel:+919876543210",
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
      href: "https://linkedin.com/in/shriraj-naik",
      color: "hover:text-blue-400",
    },
    {
      icon: <Github className="w-6 h-6" />,
      label: "GitHub",
      href: "https://github.com/shriraj-naik",
      color: "hover:text-gray-400",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      href: "mailto:shriraj.naik@example.com",
      color: "hover:text-teal-400",
    },
  ]

  return (
    <section id="contact" className="py-20 bg-slate-950">
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

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
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
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 lg:p-8 rounded-2xl border border-slate-700"
          >
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-4 text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-300 text-sm lg:text-base"
                    placeholder="Enter your full name"
                  />
                  <label className="absolute -top-2 left-3 bg-slate-800 px-2 text-xs text-teal-400 font-medium">
                    Full Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-4 text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-300 text-sm lg:text-base"
                    placeholder="your.email@example.com"
                  />
                  <label className="absolute -top-2 left-3 bg-slate-800 px-2 text-xs text-teal-400 font-medium">
                    Email Address
                  </label>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-4 text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-300 text-sm lg:text-base"
                  placeholder="What would you like to discuss?"
                />
                <label className="absolute -top-2 left-3 bg-slate-800 px-2 text-xs text-teal-400 font-medium">
                  Subject
                </label>
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-4 text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-300 resize-none text-sm lg:text-base"
                  placeholder="Tell me about your project, requirements, or any questions you have..."
                />
                <label className="absolute -top-2 left-3 bg-slate-800 px-2 text-xs text-teal-400 font-medium">
                  Message
                </label>
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
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
