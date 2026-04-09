import '@/assets/styles/components/modal.css'
import { useTranslation } from 'react-i18next'

type Props = {
    message?: string
    content?: React.ReactNode
    onAccept: (() => void) | null
    onClose: () => void
}

const Modal = ({ message, content, onAccept, onClose }: Props) => {
    const { t } = useTranslation()
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {content ? content : <p>{message}</p>}
                {!content && (
                    <div className="modal-buttons">
                        <button onClick={onClose}>{t('modal.cancel')}</button>
                        <button
                            onClick={() => {
                                onAccept?.()
                                onClose()
                            }}
                        >
                            {t('modal.accept')}
                        </button>
                    </div>
                )}
                <button className="modal-close" onClick={onClose}>
                    {t('modal.close')}
                </button>
            </div>
        </div>
    )
}

export default Modal
