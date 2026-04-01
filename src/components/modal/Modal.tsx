import '@/assets/styles/components/modal.css'

type Props = {
    message: string
    onAccept: (() => void) | null
    onClose: () => void
}

const Modal = ({ message, onAccept, onClose }: Props) => {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <p>{message}</p>

                <div className="modal-buttons">
                    <button onClick={onClose}>Cancel</button>

                    <button
                        onClick={() => {
                            onAccept?.()
                            onClose()
                        }}
                    >
                        Accept
                    </button>
                </div>

                <button className="modal-close" onClick={onClose}>
                    X
                </button>
            </div>
        </div>
    )
}

export default Modal
