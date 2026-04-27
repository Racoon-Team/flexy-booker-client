import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Alert from '@/components/ui/Alert'
import type { ReactNode } from 'react'
import type { DialogProps } from '@/components/ui/Dialog'
import type { ButtonProps } from '@/components/ui/Button'

type StatusType = 'info' | 'success' | 'warning' | 'danger'

interface ConfirmDialogProps extends DialogProps {
    cancelText?: ReactNode | string
    confirmText?: ReactNode | string
    confirmButtonProps?: ButtonProps
    cancelButtonProps?: ButtonProps
    type?: StatusType
    title?: ReactNode | string
    onCancel?: () => void
    onConfirm?: () => void
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
    const {
        type = 'info',
        title,
        children,
        onCancel,
        onConfirm,
        cancelText = 'Cancel',
        confirmText = 'Confirm',
        confirmButtonProps,
        cancelButtonProps,
        ...rest
    } = props

    const handleCancel = () => {
        onCancel?.()
    }

    const handleConfirm = () => {
        onConfirm?.()
    }

    return (
        <Dialog
            contentClassName="pb-0 px-0"
            onClose={onCancel}
            onRequestClose={onCancel}
            {...rest}
        >
            <div className="px-6 pb-6 pt-4">
                <Alert type={type} title={title} showIcon>
                    {children}
                </Alert>
            </div>

            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-2xl rounded-br-2xl">
                <div className="flex justify-end items-center gap-2">
                    <Button
                        size="sm"
                        onClick={handleCancel}
                        {...cancelButtonProps}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        size="sm"
                        variant="solid"
                        onClick={handleConfirm}
                        {...confirmButtonProps}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default ConfirmDialog
