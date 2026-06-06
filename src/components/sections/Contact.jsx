import { useState } from "react"
import { motion } from "framer-motion"
import emailjs from "@emailjs/browser"
// ✅ Contact.jsx import — yeh use karo
import { Mail, MapPin, Phone, GitBranch, ExternalLink, Send } from "lucide-react"
import SectionTitle from "../ui/SectionTitle"

// ── Animation ────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0  },
}

// ── Static Data ──────────────────────────────────────
const socialLinks = [
  {
    id: 1,
    icon: GitBranch,
    label: "GitHub",
    href: "https://github.com/YOUR_USERNAME",
  },
  {
    id: 2,
    icon: ExternalLink,
    label: "LinkedIn",
    href: "https://linkedin.com/in/muhammad-sohail-a15a38248",
  },
  {
    id: 3,
    icon: Mail,
    label: "Email",
    href: "mailto:your@email.com",
  },
]
// ── Config ───────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_js2nn5s"   // ← apna daalo
const EMAILJS_TEMPLATE_ID = "template_wkds5ee"  // ← apna daalo
const EMAILJS_PUBLIC_KEY  = "Gqhx4gAU52ryh1e76"   // ← apna daalo
const contactInfo = [
  { icon: MapPin, text: "Karachi, Pakistan"    },
  { icon: Mail,   text: "msohailg211@gmail.com"       },
  { icon: Phone,  text: "+92 3110297772"      },
]

// ── Initial Form State ───────────────────────────────
const initialForm = { name: "", email: "", message: "" }

// ── Component ────────────────────────────────────────
const Contact = () => {

  const [form, setForm]       = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Submit handler — EmailJS baad mein add karein ge
const handleSubmit = (e) => {
  e.preventDefault()
  setLoading(true)

  emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      from_name:  form.name,
      from_email: form.email,
      message:    form.message,
    },
    EMAILJS_PUBLIC_KEY
  )
  .then(() => {
    setLoading(false)
    setSent(true)
    setForm(initialForm)
  })
  .catch((error) => {
    console.error("EmailJS error:", error)
    setLoading(false)
    alert("Something went wrong. Please try again!")
  })
}

  return (
    <section
      id="contact"
      className="py-24 px-8 md:px-16 lg:px-24"
    >

      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionTitle label="Get In" highlight="Touch" />
        <p className="font-dm text-muted text-sm mt-2">
          Have a project in mind? Let's discuss details.
        </p>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-12">

        {/* ── Left — Info ── */}
        <motion.div
          className="flex flex-col gap-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >

          <p className="font-dm text-muted leading-relaxed">
            I am currently open to internship opportunities and
            freelance projects. Whether you have a question or just
            want to say hello — my inbox is always open!
          </p>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            {contactInfo.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 text-muted"
              >
                <item.icon size={16} className="text-cyan shrink-0" />
                <span className="font-dm text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-surface border border-white/5 rounded-lg text-muted hover:text-cyan hover:border-cyan transition-colors duration-200"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>

        </motion.div>

        {/* ── Right — Form ── */}
        <motion.div
          className="bg-surface border border-white/5 rounded-xl p-6 flex flex-col gap-5"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-cyan text-xs uppercase tracking-widest">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="bg-bg border border-white/10 rounded-lg px-4 py-3 text-light text-sm font-dm placeholder:text-muted focus:outline-none focus:border-accent transition-colors duration-200"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-cyan text-xs uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="bg-bg border border-white/10 rounded-lg px-4 py-3 text-light text-sm font-dm placeholder:text-muted focus:outline-none focus:border-accent transition-colors duration-200"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-cyan text-xs uppercase tracking-widest">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              rows={5}
              className="bg-bg border border-white/10 rounded-lg px-4 py-3 text-light text-sm font-dm placeholder:text-muted focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || sent}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all duration-200 bg-linear-to-r from-cyan to-accent text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Sending..."
            ) : sent ? (
              "Message Sent ✓"
            ) : (
              <>
                Send Message <Send size={14} />
              </>
            )}
          </button>

        </motion.div>

      </div>

    </section>
  )
}

export default Contact