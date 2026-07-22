import { useState } from 'react'
import Switcher from '@/components/ui/Switcher'
import { useTranslation } from 'react-i18next'

type Props = {
    isOpen: boolean
    onClose: () => void
}

const CreateUserModal = ({ isOpen, onClose }: Props) => {
    const [role, setRole] = useState<'client' | 'owner' | 'admin'>('client')
    const { t } = useTranslation()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    const [verified, setVerified] = useState(false)
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)

    if (!isOpen) return null
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
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
                        className="rounded border px-2 text-gray-500 hover:text-gray-700"
                    >
                        X
                    </button>
                </div>

                <div className="p-6">
                    <label className="mb-3 block text-sm font-medium">
                        {t('createUserModal.accountType')}
                    </label>

                    <div className="grid grid-cols-3 gap-4">
                        {roles.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => setRole(item.value)}
                                className={`rounded-lg border p-4 text-left transition ${
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
                                className="w-full rounded-lg border p-2"
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
                                className="w-full rounded-lg border p-2"
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
                                className="w-full rounded-lg border p-2"
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
                                className="w-full rounded-lg border p-2"
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
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border px-4 py-2"
                        >
                            {t('createUserModal.buttons.cancel')}
                        </button>

                        <button
                            type="button"
                            className="rounded-lg bg-black px-4 py-2 text-white"
                        >
                            {t('createUserModal.buttons.create')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUserModal
