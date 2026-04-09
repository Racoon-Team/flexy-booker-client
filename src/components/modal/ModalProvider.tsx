import { createContext, useContext, useState } from 'react'
import Modal from './Modal'

export type ModalData = {
    message?: string
    content?: React.ReactNode
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
        content: null as React.ReactNode | null,
        onAccept: null as null | (() => void),
    })

    const openModal = (data: ModalData) => {
        setModal({
            isOpen: true,
            message: data.message || '',
            content: data.content || null,
            onAccept: data.onAccept || null,
        })
    }

    const closeModal = () => {
        setModal({
            isOpen: false,
            message: '',
            content: null,
            onAccept: null,
        })
    }

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {modal.isOpen && (
                <Modal
                    message={modal.message}
                    content={modal.content}
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
