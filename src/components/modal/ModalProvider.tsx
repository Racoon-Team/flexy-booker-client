import { createContext, useContext, useState } from 'react'
import Modal from './Modal'

export type ModalData = {
    message?: string
    content?: React.ReactNode
    title?: string
    type?: 'info' | 'success' | 'warning' | 'danger'

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
        title: '',
        type: 'info' as 'info' | 'success' | 'warning' | 'danger',
        onAccept: null as null | (() => void),
    })

    const openModal = (data: ModalData) => {
        setModal({
            isOpen: true,
            message: data.message || '',
            content: data.content || null,
            title: data.title || '',
            type: data.type || 'info',

            onAccept: data.onAccept || null,
        })
    }

    const closeModal = () => {
        setModal({
            isOpen: false,
            message: '',
            content: null,
            title: '',
            type: 'info',
            onAccept: null,
        })
    }

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {modal.isOpen && (
                <Modal
                    isOpen={modal.isOpen}
                    message={modal.message}
                    title={modal.title}
                    type={modal.type}
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
