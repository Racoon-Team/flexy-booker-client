import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { createCategory } from '@/services/categoriesServices'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

type CategoryCreateFormProps = {
    parentId: string
    parentName: string
    onCreateSuccess?: () => void
    onSavingChange?: (saving: boolean) => void
}

const CategoryCreateForm = ({
    parentId,
    parentName,
    onCreateSuccess,
    onSavingChange,
}: CategoryCreateFormProps) => {
    const { t } = useTranslation()

    const schema = useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .min(1, t('categoriesView.create.nameRequired')),
                slug: z
                    .string()
                    .min(1, t('categoriesView.create.slugRequired')),
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

    const onSubmit = async (values: FormSchema) => {
        onSavingChange?.(true)

        try {
            await createCategory({
                name: values.name,
                slug: values.slug,
                parent_id: parentId,
            })
            reset()
            toast.push(
                <Notification type="success">
                    {t('categoriesView.create.createSuccess')}
                </Notification>,
                { placement: 'top-center' },
            )
            onCreateSuccess?.()
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
            onSavingChange?.(false)
        }
    }

    return (
        <div className="p-6">
            <Form id="category-create-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-6">
                    <div className="flex-1 border border-gray-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-4">
                            {t('categoriesView.create.infoSection')}
                        </p>

                        <FormItem label={t('categoriesView.form.parentLbl')}>
                            <Input
                                value={`${parentName} (${parentId.slice(0, 8)}...)`}
                                disabled
                            />
                        </FormItem>

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
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default CategoryCreateForm
