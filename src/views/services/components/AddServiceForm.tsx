import { useState } from 'react'
import { useModal } from '@/components/modal/ModalProvider'
import useAuth from '@/auth/useAuth'
import { getMyBusiness, createService } from '@/services/BusinessService'
import AddServiceStep1 from './AddServiceStep1'
import AddServiceStep2 from './AddServiceStep2'
import type { CustomField, Step1Data } from './addServiceTypes'

export default function AddServiceForm() {
    const { closeModal } = useModal()
    const { user } = useAuth()

    const [currentStep, setCurrentStep] = useState<1 | 2>(1)
    const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    function handleStep1Next(data: Step1Data) {
        setStep1Data(data)
        setCurrentStep(2)
    }

    async function handleStep2Submit(
        schedule: string[],
        customFields: CustomField[],
    ) {
        if (!step1Data || !user.userId) return

        setIsSubmitting(true)
        setErrorMessage('')

        try {
            const business = await getMyBusiness(Number(user.userId))

            await createService({
                business_id: business.id,
                name: step1Data.name,
                description: step1Data.description,
                price: step1Data.price ? Number(step1Data.price) : undefined,
                schedule,
                custom_fields: customFields,
            })

            closeModal()
        } catch {
            setErrorMessage('An error occurred while creating the service')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Add Service
            </h2>
            <p className="text-sm text-gray-400 mb-4">
                Step {currentStep} of 2
            </p>

            {currentStep === 1 && (
                <AddServiceStep1
                    onNext={handleStep1Next}
                    onCancel={closeModal}
                />
            )}

            {currentStep === 2 && (
                <AddServiceStep2
                    isSubmitting={isSubmitting}
                    errorMessage={errorMessage}
                    onBack={() => setCurrentStep(1)}
                    onCancel={closeModal}
                    onSubmit={handleStep2Submit}
                />
            )}
        </div>
    )
}
