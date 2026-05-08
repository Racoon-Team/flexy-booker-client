import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { HiX } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'

type Props = {
    message?: string
    content?: React.ReactNode
    onAccept: (() => void) | null
    onClose: () => void
}

const Modal = ({ message, content, onAccept, onClose }: Props) => {
    const { t } = useTranslation()

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    return createPortal(
        <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
        >
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <motion.div
                className="relative bg-white rounded-xl shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                    aria-label={t('modal.close')}
                >
                    <HiX className="text-xl" />
                </button>

                <div className="p-6">
                    {content ?? (
                        <>
                            <p className="text-gray-700 mb-4">{message}</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                                    onClick={onClose}
                                >
                                    {t('modal.cancel')}
                                </button>
                                <button
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                                    onClick={() => {
                                        onAccept?.()
                                        onClose()
                                    }}
                                >
                                    {t('modal.accept')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>,
        document.body,
    )
}

export default Modal
