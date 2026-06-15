import AsyncSelect from 'react-select/async'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import {
    getCategoryById,
    updateCategory,
    searchCategories,
    type CategoryDetail,
} from '@/services/categoriesServices'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

type ParentOption = {
    value: string
    label: string
}

type CategoryDetailFormProps = {
    categoryId: string
    onSaveSuccess?: () => void
}

const CategoryDetailForm = ({
    categoryId,
    onSaveSuccess,
}: CategoryDetailFormProps) => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [category, setCategory] = useState<CategoryDetail | null>(null)
    const { t } = useTranslation()

    const schema = useMemo(
        () =>
            z.object({
                name: z.string().min(1, t('categoriesView.form.nameRequired')),
                slug: z.string().min(1, t('categoriesView.form.slugRequired')),
                icon: z.string().optional(),
                description: z.string().optional(),
                parent_id: z.string().nullable().optional(),
            }),
        [t],
    )

    type FormSchema = z.infer<typeof schema>

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
        setError,
    } = useForm<FormSchema>({
        resolver: zodResolver(schema),
    })

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const data = await getCategoryById(categoryId)
                setCategory(data)
                reset({
                    name: data.name,
                    slug: data.slug,
                    icon: data.icon ?? '',
                    description: data.description ?? '',
                    parent_id: data.parent?.id ?? null,
                })
            } catch (error) {
                console.error('Failed to load category', error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [categoryId, reset])

    const loadParentOptions = async (
        inputValue: string,
    ): Promise<ParentOption[]> => {
        if (!inputValue) return []
        try {
            const results = await searchCategories(inputValue)
            return results
                .filter((c) => c.parent === null && c.id !== categoryId)
                .map((c) => ({
                    value: c.id,
                    label: `${c.name} (${c.id.slice(0, 8)}...)`,
                }))
        } catch {
            return []
        }
    }

    const onSubmit = async (values: FormSchema) => {
        if (!category) return
        setSaving(true)

        const patch: Record<string, unknown> = {}
        if (values.name !== category.name) patch.name = values.name
        if (values.slug !== category.slug) patch.slug = values.slug
        if (values.icon !== (category.icon ?? '')) patch.icon = values.icon
        if (values.description !== (category.description ?? ''))
            patch.description = values.description
        if (values.parent_id !== (category.parent?.id ?? null))
            patch.parent_id = values.parent_id

        if (Object.keys(patch).length === 0) {
            setSaving(false)
            return
        }

        try {
            await updateCategory(categoryId, patch)
            const updated = await getCategoryById(categoryId)
            setCategory(updated)
            reset({
                name: updated.name,
                slug: updated.slug,
                icon: updated.icon ?? '',
                description: updated.description ?? '',
                parent_id: updated.parent?.id ?? null,
            })
            toast.push(
                <Notification type="success">
                    {t('categoriesView.form.saveSuccess')}
                </Notification>,
                { placement: 'top-center' },
            )
            onSaveSuccess?.()
        } catch (error: unknown) {
            const err = error as {
                response?: { status?: number; data?: { message?: string } }
            }
            const status = err?.response?.status
            const message =
                err?.response?.data?.message ?? 'Something went wrong'

            if (status === 409) {
                setError('slug', { message })
            } else if (status === 422) {
                setError('name', { message })
            }
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="animate-pulse space-y-4 p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i}>
                        <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                        <div className="h-9 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="p-6">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormItem
                    label={t('categoriesView.form.nameLbl')}
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t('categoriesView.form.namePh')}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={t('categoriesView.form.slugLbl')}
                    invalid={Boolean(errors.slug)}
                    errorMessage={errors.slug?.message}
                >
                    <Controller
                        name="slug"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t('categoriesView.form.slugPh')}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={t('categoriesView.form.parentLbl')}
                    invalid={Boolean(errors.parent_id)}
                    errorMessage={errors.parent_id?.message}
                >
                    <Controller
                        name="parent_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                componentAs={AsyncSelect}
                                isClearable
                                cacheOptions
                                loadOptions={loadParentOptions}
                                defaultOptions
                                placeholder={t('categoriesView.form.parentPh')}
                                value={
                                    field.value
                                        ? {
                                              value: field.value,
                                              label:
                                                  category?.parent?.id ===
                                                  field.value
                                                      ? `${category.parent.name} (${field.value.slice(0, 8)}...)`
                                                      : field.value,
                                          }
                                        : null
                                }
                                onChange={(option: ParentOption | null) =>
                                    field.onChange(option?.value ?? null)
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={t('categoriesView.form.iconLbl')}
                    invalid={Boolean(errors.icon)}
                    errorMessage={errors.icon?.message}
                >
                    <Controller
                        name="icon"
                        control={control}
                        render={({ field }) => (
                            <Input
                                placeholder={t('categoriesView.form.iconPh')}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={t('categoriesView.form.descriptionLbl')}
                    invalid={Boolean(errors.description)}
                    errorMessage={errors.description?.message}
                >
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <textarea
                                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                                placeholder={t(
                                    'categoriesView.form.descriptionPh',
                                )}
                                rows={3}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <div className="flex justify-end mt-2">
                    <Button type="submit" variant="solid" loading={saving}>
                        {saving
                            ? t('categoriesView.form.savingBtn')
                            : t('categoriesView.form.saveBtn')}
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default CategoryDetailForm
