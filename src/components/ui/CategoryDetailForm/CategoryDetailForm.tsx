import CategoryTagsEditor from '@/components/ui/CategoryTagsEditor'
import AsyncSelect from 'react-select/async'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
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
    onSavingChange?: (saving: boolean) => void
}

const CategoryDetailForm = ({
    categoryId,
    onSaveSuccess,
    onSavingChange,
}: CategoryDetailFormProps) => {
    const [loading, setLoading] = useState(true)
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

                show_on_homepage: z.boolean(),
                show_in_search: z.boolean(),
                allow_new_businesses: z.boolean(),
                featured_on_homepage: z.boolean(),
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
        watch,
        setValue,
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

                    show_on_homepage: data.visibility.show_on_homepage,
                    show_in_search: data.visibility.show_in_search,
                    allow_new_businesses: data.visibility.allow_new_businesses,
                    featured_on_homepage: data.visibility.featured_on_homepage,
                })
            } catch (error) {
                console.error('Failed to load category', error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [categoryId, reset])

    const showHomepage = watch('show_on_homepage')

    useEffect(() => {
        if (!showHomepage) {
            setValue('featured_on_homepage', false)
        }
    }, [showHomepage, setValue])

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

        onSavingChange?.(true)

        const patch: Record<string, unknown> = {}
        if (values.name !== category.name) patch.name = values.name
        if (values.slug !== category.slug) patch.slug = values.slug
        if (values.icon !== (category.icon ?? '')) patch.icon = values.icon
        if (values.description !== (category.description ?? ''))
            patch.description = values.description
        if (values.parent_id !== (category.parent?.id ?? null))
            patch.parent_id = values.parent_id
        patch.visibility = {
            show_on_homepage: values.show_on_homepage,
            show_in_search: values.show_in_search,
            allow_new_businesses: values.allow_new_businesses,
            featured_on_homepage: values.featured_on_homepage,
        }
        if (Object.keys(patch).length === 0) {
            onSavingChange?.(false)
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

                show_on_homepage: updated.visibility.show_on_homepage,
                show_in_search: updated.visibility.show_in_search,
                allow_new_businesses: updated.visibility.allow_new_businesses,
                featured_on_homepage: updated.visibility.featured_on_homepage,
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
                setError('featured_on_homepage', {
                    message,
                })
            }
        } finally {
            onSavingChange?.(false)
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
            <Form id="category-detail-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-6">
                    <div className="flex-1 border border-gray-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-4">
                            {t('categoriesView.form.infoSection')}
                        </p>

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
                                        placeholder={t(
                                            'categoriesView.form.namePh',
                                        )}
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
                                        placeholder={t(
                                            'categoriesView.form.slugPh',
                                        )}
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
                                        placeholder={t(
                                            'categoriesView.form.parentPh',
                                        )}
                                        value={
                                            field.value
                                                ? {
                                                      value: field.value,
                                                      label:
                                                          category?.parent
                                                              ?.id ===
                                                          field.value
                                                              ? `${category.parent.name} (${field.value.slice(0, 8)}...)`
                                                              : field.value,
                                                  }
                                                : null
                                        }
                                        onChange={(
                                            option: ParentOption | null,
                                        ) =>
                                            field.onChange(
                                                option?.value ?? null,
                                            )
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
                                        placeholder={t(
                                            'categoriesView.form.iconPh',
                                        )}
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
                    </div>

                    <div className="w-64 flex-shrink-0 space-y-4">
                        <div className="border border-gray-200 rounded-xl p-4">
                            <p className="text-sm font-semibold text-gray-700 mb-4">
                                {t('createCategoryModal.visibility')}
                            </p>

                            <Controller
                                name="show_on_homepage"
                                control={control}
                                render={({ field }) => (
                                    <label className="flex justify-between items-center py-2">
                                        <span>
                                            {t(
                                                'createCategoryModal.showHomepage',
                                            )}
                                        </span>

                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            disabled={
                                                category?.status === 'archived'
                                            }
                                            onChange={(e) =>
                                                field.onChange(e.target.checked)
                                            }
                                        />
                                    </label>
                                )}
                            />
                            <Controller
                                name="show_in_search"
                                control={control}
                                render={({ field }) => (
                                    <label className="flex justify-between items-center py-2">
                                        <span>
                                            {t(
                                                'createCategoryModal.showSearch',
                                            )}
                                        </span>

                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            disabled={
                                                category?.status === 'archived'
                                            }
                                            onChange={(e) =>
                                                field.onChange(e.target.checked)
                                            }
                                        />
                                    </label>
                                )}
                            />
                            <Controller
                                name="allow_new_businesses"
                                control={control}
                                render={({ field }) => (
                                    <label className="flex justify-between items-center py-2">
                                        <span>
                                            {t(
                                                'createCategoryModal.allowBusinesses',
                                            )}
                                        </span>

                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            disabled={
                                                category?.status === 'archived'
                                            }
                                            onChange={(e) =>
                                                field.onChange(e.target.checked)
                                            }
                                        />
                                    </label>
                                )}
                            />

                            <Controller
                                name="featured_on_homepage"
                                control={control}
                                render={({ field }) => (
                                    <label className="flex justify-between items-center py-2">
                                        <span>
                                            {t(
                                                'createCategoryModal.featuredHomepage',
                                            )}
                                        </span>

                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            disabled={
                                                !showHomepage ||
                                                category?.status === 'archived'
                                            }
                                            onChange={(e) =>
                                                field.onChange(e.target.checked)
                                            }
                                        />
                                    </label>
                                )}
                            />

                            {errors.featured_on_homepage && (
                                <p className="text-xs text-red-500 mt-2">
                                    {errors.featured_on_homepage.message}
                                </p>
                            )}
                        </div>
                        <div className="border border-gray-200 rounded-xl p-4">
                            {category && (
                                <CategoryTagsEditor
                                    categoryId={categoryId}
                                    initialTags={category.tags}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default CategoryDetailForm
