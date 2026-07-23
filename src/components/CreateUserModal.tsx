import { useState } from 'react'
import Switcher from '@/components/ui/Switcher'
import { useTranslation } from 'react-i18next'
import { createUser } from '@/services/adminService'

type Props = {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

const CreateUserModal = ({ isOpen, onClose, onSuccess }: Props) => {
    const { t } = useTranslation()

    const [role, setRole] = useState<'client' | 'owner' | 'admin'>('client')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [verified, setVerified] = useState(false)
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const roles = [
        {
            value: 'client',
            title: t('createUserModal.roles.client.title'),
            description: t('createUserModal.roles.client.description'),
        },
        {
            value: 'owner',
            title: t('createUserModal.roles.owner.title'),
            description: t('createUserModal.roles.owner.description'),
        },
        {
            value: 'admin',
            title: t('createUserModal.roles.admin.title'),
            description: t('createUserModal.roles.admin.description'),
        },
    ] as const

    const validateEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

    const handleSubmit = async () => {
        setError(null)

        if (!firstName.trim()) {
            setError(t('createUserModal.errors.firstNameRequired'))
            return
        }
        if (!email.trim()) {
            setError(t('createUserModal.errors.emailRequired'))
            return
        }
        if (!validateEmail(email)) {
            setError(t('createUserModal.errors.emailInvalid'))
            return
        }

        setIsLoading(true)
        try {
            await createUser({
                first_name: firstName.trim(),
                last_name: lastName.trim() || undefined,
                email: email.trim(),
                phone: phone.trim() || undefined,
                role,
                verified,
                send_welcome_email: sendWelcomeEmail,
            })

            setFirstName('')
            setLastName('')
            setEmail('')
            setPhone('')
            setRole('client')
            setVerified(false)
            setSendWelcomeEmail(true)

            onSuccess?.()
            onClose()
        } catch (err: unknown) {
            const e = err as {
                response?: { status?: number; data?: { message?: string } }
            }
            const status = e?.response?.status
            const message = e?.response?.data?.message

            if (status === 409) {
                setError(t('createUserModal.errors.emailExists'))
            } else {
                setError(message ?? t('createUserModal.errors.generic'))
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b p-6">
                    <div>
                        <p className="text-sm text-gray-500">
                            {t('createUserModal.adminAction')}
                        </p>
                        <h2 className="text-xl font-semibold">
                            {t('createUserModal.title')}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {t('createUserModal.description')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded border px-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                        X
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <label className="mb-3 block text-sm font-medium">
                        {t('createUserModal.accountType')}
                    </label>

                    <div className="grid grid-cols-3 gap-4">
                        {roles.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                disabled={isLoading}
                                onClick={() => setRole(item.value)}
                                className={`rounded-lg border p-4 text-left transition disabled:opacity-50 ${
                                    role === item.value
                                        ? 'border-black bg-gray-50'
                                        : 'border-gray-300'
                                }`}
                            >
                                <div className="mb-2 flex items-center gap-2">
                                    <span
                                        className={`h-4 w-4 rounded-full border ${
                                            role === item.value
                                                ? 'border-black bg-black'
                                                : 'border-gray-400'
                                        }`}
                                    />
                                    <h3 className="font-semibold">
                                        {item.title}
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {item.description}
                                </p>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                {t('createUserModal.fields.firstName')}
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={isLoading}
                                className="w-full rounded-lg border p-2 disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                {t('createUserModal.fields.lastName')}
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={isLoading}
                                className="w-full rounded-lg border p-2 disabled:opacity-50"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="mb-1 block text-sm font-medium">
                                {t('createUserModal.fields.email')}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="w-full rounded-lg border p-2 disabled:opacity-50"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                {t('createUserModal.fields.phone')}
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={isLoading}
                                className="w-full rounded-lg border p-2 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="mt-8 space-y-4 border-t pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">
                                    {t('createUserModal.switches.verified')}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {t('createUserModal.switches.verifiedDesc')}
                                </p>
                            </div>
                            <Switcher
                                checked={verified}
                                onChange={setVerified}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">
                                    {t('createUserModal.switches.welcomeEmail')}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {t(
                                        'createUserModal.switches.welcomeEmailDesc',
                                    )}
                                </p>
                            </div>
                            <Switcher
                                checked={sendWelcomeEmail}
                                onChange={setSendWelcomeEmail}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-lg border px-4 py-2 disabled:opacity-50"
                        >
                            {t('createUserModal.buttons.cancel')}
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    {t('createUserModal.buttons.creating')}
                                </>
                            ) : (
                                t('createUserModal.buttons.create')
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUserModal
