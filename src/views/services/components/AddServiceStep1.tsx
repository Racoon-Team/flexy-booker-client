import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { Switcher } from '@/components/ui'
import type {
    Step1Data,
    CustomField,
    NumericField,
    SelectField,
    MultiSelectField,
} from './addServiceTypes'
import { useTranslation } from 'react-i18next'

type Step1FormSchema = {
    name: string
    description?: string
    price?: number
}

type Props = {
    onNext: (data: Step1Data, customFields: CustomField[]) => void
    onCancel: () => void
}

export default function AddServiceStep1({ onNext, onCancel }: Props) {
    const { t } = useTranslation()

    const step1Schema = z.object({
        name: z.string().min(1, {
            message: t('servicesView.addService.errors.nameRequired'),
        }),
        description: z.string().optional(),
        price: z.number().positive().optional(),
    })

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

    function handleFormSubmit(values: Step1FormSchema) {
        const customFields = showCustomFields ? buildCustomFields() : []
        onNext(values, customFields)
    }

    return (
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
            <FormItem
                label={t('servicesView.addService.fields.name')}
                invalid={Boolean(errors.name)}
                errorMessage={errors.name?.message}
            >
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            placeholder={t(
                                'servicesView.addService.fields.namePH',
                            )}
                            autoComplete="off"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label={t('servicesView.addService.fields.description')}
                invalid={Boolean(errors.description)}
                errorMessage={errors.description?.message}
            >
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            placeholder={t(
                                'servicesView.addService.fields.descriptionPH',
                            )}
                            autoComplete="off"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <FormItem
                label={t('servicesView.addService.fields.price')}
                invalid={Boolean(errors.price)}
                errorMessage={errors.price?.message}
            >
                <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="number"
                            placeholder={t(
                                'servicesView.addService.fields.pricePH',
                            )}
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
                        {t('servicesView.addService.extraOptions.title')}
                    </span>
                    <Switcher
                        checked={showCustomFields}
                        onChange={(checked) => setShowCustomFields(checked)}
                    />
                </div>

                {showCustomFields && (
                    <div className="flex flex-col gap-6">
                        <div>
                            <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={numericActive}
                                    onChange={(e) =>
                                        setNumericActive(e.target.checked)
                                    }
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {t(
                                        'servicesView.addService.extraOptions.numeric',
                                    )}
                                </span>
                            </label>
                            {numericActive && (
                                <div className="pl-6">
                                    <Input
                                        type="text"
                                        placeholder={t(
                                            'servicesView.addService.extraOptions.fieldNamePH',
                                        )}
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
                        <div>
                            <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectActive}
                                    onChange={(e) =>
                                        setSelectActive(e.target.checked)
                                    }
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {t(
                                        'servicesView.addService.extraOptions.select',
                                    )}
                                </span>
                            </label>
                            {selectActive && (
                                <div className="pl-6 flex flex-col gap-2">
                                    <Input
                                        type="text"
                                        placeholder={t(
                                            'servicesView.addService.extraOptions.fieldNamePH',
                                        )}
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
                                                    placeholder={t(
                                                        'servicesView.addService.extraOptions.optionPH',
                                                        { number: index + 1 },
                                                    )}
                                                    value={option}
                                                    onChange={(e) =>
                                                        updateOption(
                                                            'select',
                                                            index,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {selectField.options.length >
                                                    1 && (
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
                                        onClick={() => addOption('select')}
                                        className="text-blue-600 text-sm self-start"
                                    >
                                        {t(
                                            'servicesView.addService.extraOptions.addOption',
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 mb-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={multiSelectActive}
                                    onChange={(e) =>
                                        setMultiSelectActive(e.target.checked)
                                    }
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {t(
                                        'servicesView.addService.extraOptions.multiselect',
                                    )}
                                </span>
                            </label>
                            {multiSelectActive && (
                                <div className="pl-6 flex flex-col gap-2">
                                    <Input
                                        type="text"
                                        placeholder={t(
                                            'servicesView.addService.extraOptions.fieldNamePH',
                                        )}
                                        value={multiSelectField.label}
                                        onChange={(e) =>
                                            setMultiSelectField((prev) => ({
                                                ...prev,
                                                label: e.target.value,
                                            }))
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
                                                    placeholder={t(
                                                        'servicesView.addService.extraOptions.optionPH',
                                                        { number: index + 1 },
                                                    )}
                                                    value={option}
                                                    onChange={(e) =>
                                                        updateOption(
                                                            'multiselect',
                                                            index,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {multiSelectField.options
                                                    .length > 1 && (
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
                                        onClick={() => addOption('multiselect')}
                                        className="text-blue-600 text-sm self-start"
                                    >
                                        {t(
                                            'servicesView.addService.extraOptions.addOption',
                                        )}
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
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                >
                    {t('modal.cancel')}
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                    {t('servicesView.addService.buttons.next')}
                </button>
            </div>
        </Form>
    )
}
