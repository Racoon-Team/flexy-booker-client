import { useMemo, useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, Form } from '@/components/ui/Form'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { useTranslation } from 'react-i18next'

interface ClientSignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
}

type ClientSignUpFormSchema = {
    fullName: string
    email: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
}

const ClientSignUpForm = (props: ClientSignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props

    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { signUp } = useAuth()

    const { t } = useTranslation()

    const validationSchema = useMemo(
        () =>
            z
                .object({
                    fullName: z.string().min(1, {
                        message: t('signUp.client.errors.fullName'),
                    }),
                    email: z.email({ message: t('common.errors.email') }),
                    password: z.string().min(6, {
                        message: t('common.errors.password'),
                    }),
                    confirmPassword: z.string().min(1, {
                        message: t('common.errors.confirmPassword'),
                    }),
                    acceptTerms: z.boolean().refine((val) => val === true, {
                        message: t('common.errors.acceptTerms'),
                    }),
                })
                .refine((data) => data.password === data.confirmPassword, {
                    message: t('common.errors.passwordMatch'),
                    path: ['confirmPassword'],
                }),
        [t],
    )

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ClientSignUpFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
    })

    const onSignUp = async (values: ClientSignUpFormSchema) => {
        const { fullName, email, password } = values

        if (!disableSubmit) {
            setSubmitting(true)
            const result = await signUp({ userName: fullName, email, password })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }

            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignUp)}>
                <FormItem
                    label={t('signUp.client.fullName')}
                    invalid={Boolean(errors.fullName)}
                    errorMessage={errors.fullName?.message}
                >
                    <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder={t('signUp.client.fullNamePH')}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('common.signUp.email')}
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder={t('common.signUp.emailPH')}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('common.signUp.password')}
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                placeholder={t('common.signUp.passwordPH')}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('common.signUp.confirmPassword')}
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message}
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                placeholder={t(
                                    'common.signUp.confirmPasswordPH',
                                )}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    invalid={Boolean(errors.acceptTerms)}
                    errorMessage={errors.acceptTerms?.message}
                >
                    <Controller
                        name="acceptTerms"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value}
                                onChange={field.onChange}
                            >
                                {t('common.signUp.acceptTerms')}
                            </Checkbox>
                        )}
                    />
                </FormItem>
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting
                        ? t('common.signUp.submitting')
                        : t('common.signUp.submit')}
                </Button>
            </Form>
        </div>
    )
}

export default ClientSignUpForm
