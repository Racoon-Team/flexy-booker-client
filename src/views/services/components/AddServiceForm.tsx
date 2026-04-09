import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Switcher, AvailabilityCalendar } from '@/components/ui'
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

type NumericField = {
    type: 'numeric'
    label: string
}

type SelectField = {
    type: 'select'
    label: string
    options: string[]
}

type MultiSelectField = {
    type: 'multiselect'
    label: string
    options: string[]
}

type CustomField = NumericField | SelectField | MultiSelectField

export default function AddServiceForm() {
    const { closeModal } = useModal()
    const { user } = useAuth()

    const [currentStep, setCurrentStep] = useState<1 | 2>(1)
    const [step1Data, setStep1Data] = useState<Step1FormSchema | null>(null)
    const [schedule, setSchedule] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showCustomFields, setShowCustomFields] = useState(false)

    const [numericActive, setNumericActive] = useState(false)
    const [selectActive, setSelectActive] = useState(false)
    const [multiSelectActive, setMultiSelectActive] = useState(false)

    const [numericField, setNumericField] = useState<NumericField>({
        type: 'numeric',
        label: '',
    })

    const [selectField, setSelectField] = useState<SelectField>({
        type: 'select',
        label: '',
        options: [''],
    })

    const [multiSelectField, setMultiSelectField] = useState<MultiSelectField>({
        type: 'multiselect',
        label: '',
        options: [''],
    })

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

    function addOption(fieldType: 'select' | 'multiselect') {
        if (fieldType === 'select') {
            setSelectField((prev) => ({
                ...prev,
                options: [...prev.options, ''],
            }))
        } else {
            setMultiSelectField((prev) => ({
                ...prev,
                options: [...prev.options, ''],
            }))
        }
    }

    function removeOption(fieldType: 'select' | 'multiselect', index: number) {
        if (fieldType === 'select') {
            setSelectField((prev) => ({
                ...prev,
                options: prev.options.filter((_, i) => i !== index),
            }))
        } else {
            setMultiSelectField((prev) => ({
                ...prev,
                options: prev.options.filter((_, i) => i !== index),
            }))
        }
    }

    function updateOption(
        fieldType: 'select' | 'multiselect',
        index: number,
        value: string,
    ) {
        if (fieldType === 'select') {
            setSelectField((prev) => {
                const newOptions = [...prev.options]
                newOptions[index] = value
                return { ...prev, options: newOptions }
            })
        } else {
            setMultiSelectField((prev) => {
                const newOptions = [...prev.options]
                newOptions[index] = value
                return { ...prev, options: newOptions }
            })
        }
    }

    function buildCustomFields(): CustomField[] {
        const fields: CustomField[] = []

        if (numericActive && numericField.label.trim() !== '') {
            fields.push(numericField)
        }
        if (selectActive && selectField.label.trim() !== '') {
            fields.push({
                ...selectField,
                options: selectField.options.filter((o) => o.trim() !== ''),
            })
        }
        if (multiSelectActive && multiSelectField.label.trim() !== '') {
            fields.push({
                ...multiSelectField,
                options: multiSelectField.options.filter(
                    (o) => o.trim() !== '',
                ),
            })
        }

        return fields
    }

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

            const customFields = showCustomFields ? buildCustomFields() : []

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

                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm font-medium text-gray-700">
                                Extra options
                            </span>
                            <Switcher
                                checked={showCustomFields}
                                onChange={(checked) =>
                                    setShowCustomFields(checked)
                                }
                            />
                        </div>

                        {showCustomFields && (
                            <div className="flex flex-col gap-6">
                                {/* NUMERIC */}
                                <div>
                                    <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={numericActive}
                                            onChange={(e) =>
                                                setNumericActive(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Numeric
                                        </span>
                                    </label>
                                    {numericActive && (
                                        <div className="pl-6">
                                            <Input
                                                type="text"
                                                placeholder="Field name..."
                                                value={numericField.label}
                                                onChange={(e) =>
                                                    setNumericField((prev) => ({
                                                        ...prev,
                                                        label: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* SELECT */}
                                <div>
                                    <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectActive}
                                            onChange={(e) =>
                                                setSelectActive(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Selection
                                        </span>
                                    </label>
                                    {selectActive && (
                                        <div className="pl-6 flex flex-col gap-2">
                                            <Input
                                                type="text"
                                                placeholder="Field name..."
                                                value={selectField.label}
                                                onChange={(e) =>
                                                    setSelectField((prev) => ({
                                                        ...prev,
                                                        label: e.target.value,
                                                    }))
                                                }
                                            />
                                            {selectField.options.map(
                                                (option, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Input
                                                            type="text"
                                                            placeholder={`Option ${index + 1}`}
                                                            value={option}
                                                            onChange={(e) =>
                                                                updateOption(
                                                                    'select',
                                                                    index,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        {selectField.options
                                                            .length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeOption(
                                                                        'select',
                                                                        index,
                                                                    )
                                                                }
                                                                className="text-red-500 font-bold text-lg leading-none"
                                                            >
                                                                −
                                                            </button>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addOption('select')
                                                }
                                                className="text-blue-600 text-sm self-start"
                                            >
                                                + Add option
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* MULTISELECT */}
                                <div>
                                    <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={multiSelectActive}
                                            onChange={(e) =>
                                                setMultiSelectActive(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Multiple selection
                                        </span>
                                    </label>
                                    {multiSelectActive && (
                                        <div className="pl-6 flex flex-col gap-2">
                                            <Input
                                                type="text"
                                                placeholder="Field name..."
                                                value={multiSelectField.label}
                                                onChange={(e) =>
                                                    setMultiSelectField(
                                                        (prev) => ({
                                                            ...prev,
                                                            label: e.target
                                                                .value,
                                                        }),
                                                    )
                                                }
                                            />
                                            {multiSelectField.options.map(
                                                (option, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Input
                                                            type="text"
                                                            placeholder={`Option ${index + 1}`}
                                                            value={option}
                                                            onChange={(e) =>
                                                                updateOption(
                                                                    'multiselect',
                                                                    index,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                        {multiSelectField
                                                            .options.length >
                                                            1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeOption(
                                                                        'multiselect',
                                                                        index,
                                                                    )
                                                                }
                                                                className="text-red-500 font-bold text-lg leading-none"
                                                            >
                                                                −
                                                            </button>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addOption('multiselect')
                                                }
                                                className="text-blue-600 text-sm self-start"
                                            >
                                                + Add option
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

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
