import {
    HiCheckCircle,
    HiOutlineInformationCircle,
    HiOutlineExclamation,
    HiOutlineExclamationCircle,
} from 'react-icons/hi'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { useTranslation } from 'react-i18next'

type StatusType = 'info' | 'success' | 'warning' | 'danger'

type Props = {
    isOpen: boolean
    message?: string
    content?: React.ReactNode
    title?: string
    type?: StatusType
    onAccept?: (() => void) | null
    onClose: () => void
}

const StatusIcon = ({ status }: { status: StatusType }) => {
    switch (status) {
        case 'info':
            return (
                <Avatar
                    className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
                    shape="circle"
                >
                    <HiOutlineInformationCircle />
                </Avatar>
            )
        case 'success':
            return (
                <Avatar
                    className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
                    shape="circle"
                >
                    <HiCheckCircle />
                </Avatar>
            )
        case 'warning':
            return (
                <Avatar
                    className="text-amber-600 bg-amber-100 dark:text-amber-100"
                    shape="circle"
                >
                    <HiOutlineExclamationCircle />
                </Avatar>
            )
        case 'danger':
            return (
                <Avatar
                    className="text-red-600 bg-red-100 dark:text-red-100"
                    shape="circle"
                >
                    <HiOutlineExclamation />
                </Avatar>
            )
        default:
            return null
    }
}

const Modal = ({
    isOpen,
    message,
    content,
    title,
    type = 'info',
    onAccept,
    onClose,
}: Props) => {
    const { t } = useTranslation()

    return (
        <Dialog isOpen={isOpen} onClose={onClose} onRequestClose={onClose}>
            <div className="px-6 pb-6 pt-2 flex">
                <StatusIcon status={type} />

                <div className="ml-4">
                    {title && <h5 className="mb-2">{title}</h5>}
                    {content ? content : <p>{message}</p>}
                </div>
            </div>

            {!content && (
                <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-2xl rounded-br-2xl">
                    <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={onClose}>
                            {t('modal.cancel')}
                        </Button>

                        <Button
                            size="sm"
                            variant="solid"
                            onClick={() => {
                                onAccept?.()
                                onClose()
                            }}
                        >
                            {t('modal.accept')}
                        </Button>
                    </div>
                </div>
            )}
        </Dialog>
    )
}

export default Modal