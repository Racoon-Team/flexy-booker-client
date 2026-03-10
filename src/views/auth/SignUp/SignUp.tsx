import { useState } from 'react'

import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import CompanySignUpForm from './components/CompanySignUpForm'
import ClientSignUpForm from './components/ClientSignUpForm'

type ActiveTab = 'client' | 'business'

type SignUpProps = {
    disableSubmit?: boolean
    signInUrl?: string
}

export const SignUpBase = ({
    signInUrl = '/sign-in',
    disableSubmit,
}: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const [activeTab, setActiveTab] = useState<ActiveTab>('client')

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Crear Cuenta</h3>
            </div>

            <div className="flex mb-6 border rounded-lg overflow-hidden">
                <button
                    type="button"
                    className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                        activeTab === 'client'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('client')}
                >
                    Soy Cliente
                </button>
                <button
                    type="button"
                    className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                        activeTab === 'business'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('business')}
                >
                    Soy Empresa
                </button>
            </div>

            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}

            {activeTab === 'client' ? (
                <ClientSignUpForm
                    disableSubmit={disableSubmit}
                    setMessage={setMessage}
                />
            ) : (
                <CompanySignUpForm
                    disableSubmit={disableSubmit}
                    setMessage={setMessage}
                />
            )}

            <div className="mt-6 text-center">
                <span>¿Ya tienes cuenta? </span>
                <ActionLink
                    to={signInUrl}
                    className="heading-text font-bold"
                    themeColor={false}
                >
                    Iniciar sesión
                </ActionLink>
            </div>
        </>
    )
}

const SignUp = () => {
    return <SignUpBase />
}

export default SignUp
