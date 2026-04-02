import { createContext, useContext, useState } from 'react'
import Modal from './Modal'

export type ModalData = {
    message: string
    onAccept?: () => void
}

type ModalContextType = {
    openModal: (data: ModalData) => void
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modal, setModal] = useState({
        isOpen: false,
        message: '',
        onAccept: null as null | (() => void),
    })

    const openModal = (data: ModalData) => {
        setModal({
            isOpen: true,
            message: data.message,
            onAccept: data.onAccept || null,
        })
    }

    const closeModal = () => {
        setModal({
            isOpen: false,
            message: '',
            onAccept: null,
        })
    }

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {modal.isOpen && (
                <Modal
                    message={modal.message}
                    onAccept={modal.onAccept}
                    onClose={closeModal}
                />
            )}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) throw new Error('useModal must be used inside ModalProvider')
    return context
}
