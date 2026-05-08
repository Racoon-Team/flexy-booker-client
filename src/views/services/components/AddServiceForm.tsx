import { useState } from 'react'
import { useModal } from '@/components/modal/ModalProvider'
import useAuth from '@/auth/useAuth'
import { getMyBusiness, createService } from '@/services/BusinessService'
import { updateService } from '../servicesServices'
import AddServiceStep1 from './AddServiceStep1'
import AddServiceStep2 from './AddServiceStep2'
import type { CustomField, Step1Data, Service } from './addServiceTypes'
import { useTranslation } from 'react-i18next'

type Props = {
    initialService?: Service
    onSuccess?: () => void
}

export default function AddServiceForm({ initialService, onSuccess }: Props) {
    const { t } = useTranslation()
    const { closeModal } = useModal()
    const { user } = useAuth()

    const [currentStep, setCurrentStep] = useState<1 | 2>(1)
    const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const isEditing = Boolean(initialService)

    function handleStep1Next(data: Step1Data) {
        setStep1Data(data)
        setCurrentStep(2)
    }

    async function handleStep2Submit(
        schedule: string[],
        customFields: CustomField[],
    ) {
        if (!step1Data) return

        setIsSubmitting(true)
        setErrorMessage('')

        try {
            if (initialService) {
                await updateService(initialService.id, {
                    name: step1Data.name,
                    description: step1Data.description,
                    price: step1Data.price ? Number(step1Data.price) : undefined,
                    schedule,
                })
            } else {
                if (!user.userId) return
                const business = await getMyBusiness()
                await createService({
                    business_id: business.id,
                    name: step1Data.name,
                    description: step1Data.description,
                    price: step1Data.price ? Number(step1Data.price) : undefined,
                    schedule,
                    custom_fields: customFields,
                })
            }

            onSuccess?.()
            closeModal()
        } catch {
            setErrorMessage(
                t(
                    isEditing
                        ? 'servicesView.addService.errors.updateError'
                        : 'servicesView.addService.errors.createError',
                ),
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {t(isEditing ? 'servicesView.addService.editTitle' : 'servicesView.addService.title')}
            </h2>
            <p className="text-sm text-gray-400 mb-4">
                {t('servicesView.addService.step', {
                    current: currentStep,
                    total: 2,
                })}
            </p>

            {currentStep === 1 && (
                <AddServiceStep1
                    initialData={initialService ? {
                        name: initialService.name,
                        description: initialService.description,
                        price: initialService.price,
                    } : undefined}
                    onNext={handleStep1Next}
                    onCancel={closeModal}
                />
            )}

            {currentStep === 2 && (
                <AddServiceStep2
                    isSubmitting={isSubmitting}
                    errorMessage={errorMessage}
                    initialSchedule={initialService?.schedule}
                    onBack={() => setCurrentStep(1)}
                    onCancel={closeModal}
                    onSubmit={handleStep2Submit}
                />
            )}
        </div>
    )
}
