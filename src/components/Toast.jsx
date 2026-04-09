import { useState, useEffect, createContext, useContext } from 'react'
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext()

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const success = (message, duration) => addToast(message, 'success', duration)
  const error = (message, duration) => addToast(message, 'error', duration)
  const warning = (message, duration) => addToast(message, 'warning', duration)
  const info = (message, duration) => addToast(message, 'info', duration)

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  )
}

function Toast({ toast, removeToast }) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => removeToast(toast.id), 300)
    }, toast.duration)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) return 0
        return prev - (100 / (toast.duration / 50))
      })
    }, 50)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [toast.duration, toast.id, removeToast])

  const handleManualClose = () => {
    setIsVisible(false)
    setTimeout(() => removeToast(toast.id), 300)
  }

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          icon: 'text-green-500',
          text: 'text-green-800',
          Icon: CheckCircle,
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          icon: 'text-red-500',
          text: 'text-red-800',
          Icon: AlertCircle,
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-500',
          icon: 'text-yellow-500',
          text: 'text-yellow-800',
          Icon: AlertTriangle,
        }
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-500',
          icon: 'text-blue-500',
          text: 'text-blue-800',
          Icon: AlertCircle,
        }
    }
  }

  const styles = getToastStyles()

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${styles.bg} border-l-4 ${styles.border} rounded-lg shadow-lg p-4`}>
        <div className="flex items-start gap-3">
          <styles.Icon className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
          <p className={`text-sm ${styles.text} flex-1`}>{toast.message}</p>
          <button
            onClick={handleManualClose}
            className={`${styles.icon} hover:opacity-70 transition flex-shrink-0`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${styles.border.replace('border-', 'bg-')} transition-all duration-50 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default ToastProvider
