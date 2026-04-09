import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { AvailabilityCalendar } from '@/components/ui'
import { useModal } from '@/components/modal/ModalProvider'
import useAuth from '@/auth/useAuth'
import { getMyBusiness, createService } from '@/services/BusinessService'

const step1Schema = z.object({
    name: z.string().min(1, { message: 'Service name is required' }),
    description: z.string().optional(),
    price: z.number().positive().optional(),
})

type Step1FormSchema = {
    name: string
    description?: string
    price?: number
}

export default function AddServiceForm() {
    const { closeModal } = useModal()
    const { user } = useAuth()

    const [currentStep, setCurrentStep] = useState<1 | 2>(1)
    const [step1Data, setStep1Data] = useState<Step1FormSchema | null>(null)
    const [schedule, setSchedule] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<Step1FormSchema>({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            name: '',
            description: '',
            price: undefined,
        },
    })

    function handleStep1Submit(values: Step1FormSchema) {
        setStep1Data(values)
        setCurrentStep(2)
    }

    async function handleFinalSubmit() {
        if (schedule.length === 0) {
            setErrorMessage('Please select at least one time slot')
            return
        }

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
                <Form onSubmit={handleSubmit(handleStep1Submit)}>
                    <FormItem
                        label="Service Name"
                        invalid={Boolean(errors.name)}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="IT Consulting, Haircut..."
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Service Description"
                        invalid={Boolean(errors.description)}
                        errorMessage={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Details about the service"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Price (optional)"
                        invalid={Boolean(errors.price)}
                        errorMessage={errors.price?.message}
                    >
                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    placeholder="50"
                                    autoComplete="off"
                                    value={field.value ?? ''}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === ''
                                                ? undefined
                                                : Number(e.target.value),
                                        )
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                        >
                            Next
                        </button>
                    </div>
                </Form>
            )}

            {currentStep === 2 && (
                <div>
                    <AvailabilityCalendar
                        onChange={(cells) => setSchedule(cells)}
                    />

                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-2">
                            {errorMessage}
                        </p>
                    )}

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                        >
                            Cancel
                        </button>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleFinalSubmit}
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Create / Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
