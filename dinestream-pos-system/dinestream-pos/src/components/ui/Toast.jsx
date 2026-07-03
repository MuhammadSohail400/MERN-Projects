import { useEffect, useState } from 'react'
import useToast from '../../hooks/useToast'

// ─── Type configurations ──────────────────────────────────────
const TOAST_CONFIG = {
  success: {
    bg:     'bg-green-500/10',
    border: 'border-green-500/30',
    icon:   '✓',
    iconBg: 'bg-green-500',
    text:   'text-green-400',
  },
  error: {
    bg:     'bg-red-500/10',
    border: 'border-red-500/30',
    icon:   '✕',
    iconBg: 'bg-red-500',
    text:   'text-red-400',
  },
  warning: {
    bg:     'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon:   '!',
    iconBg: 'bg-yellow-500',
    text:   'text-yellow-400',
  },
  info: {
    bg:     'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon:   'i',
    iconBg: 'bg-blue-500',
    text:   'text-blue-400',
  },
}

// ─── Single Toast Item ─────────────────────────────────────────
const ToastItem = ({ toast, onClose }) => {
  const [isLeaving, setIsLeaving] = useState(false)
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => onClose(toast.id), 200)
  }

  return (
    <div
      className={`
        flex items-start gap-3
        bg-[#18181b] ${config.border} border
        rounded-xl px-4 py-3.5 pr-3
        shadow-2xl shadow-black/40
        min-w-[280px] max-w-[380px]
        transition-all duration-200
        ${isLeaving
          ? 'opacity-0 translate-x-4'
          : 'opacity-100 translate-x-0 animate-toast-in'
        }
      `}
    >
      {/* Icon */}
      <div className={`
        w-6 h-6 rounded-full ${config.iconBg}
        flex items-center justify-center
        text-white text-xs font-bold shrink-0 mt-0.5
      `}>
        {config.icon}
      </div>

      {/* Message */}
      <p className="flex-1 text-[13px] text-zinc-200 leading-snug pt-0.5">
        {toast.message}
      </p>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="
          text-zinc-500 hover:text-zinc-300
          bg-transparent border-none cursor-pointer
          text-base leading-none p-1
          transition-colors duration-150
        "
      >
        ✕
      </button>
    </div>
  )
}

// ════════════════════════════════════════════════════════
// TOAST CONTAINER — renders all active toasts
// ════════════════════════════════════════════════════════
const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="
      fixed top-4 right-4 z-[200]
      flex flex-col gap-2.5
      pointer-events-none
    ">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={removeToast} />
        </div>
      ))}

      <style>{`
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-toast-in {
          animation: toast-in 0.25s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ToastContainer