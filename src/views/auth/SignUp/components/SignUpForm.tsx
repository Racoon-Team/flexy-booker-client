import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { useTranslation } from 'react-i18next'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
}

type SignUpFormSchema = {
    userName: string
    password: string
    email: string
    confirmPassword: string
}

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props
    const { t } = useTranslation()
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { signUp } = useAuth()
    const validationSchema = z
        .object({
            email: z.string().email({
                message: t('signup.errors.email'),
            }),
            userName: z.string().min(1, {
                message: t('signup.errors.userName'),
            }),
            password: z.string().min(1, {
                message: t('signup.errors.password'),
            }),
            confirmPassword: z.string().min(1, {
                message: t('signup.errors.confirmPassword'),
            }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('signup.errors.passwordMatch'),
            path: ['confirmPassword'],
        })

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onSignUp = async (values: SignUpFormSchema) => {
        const { userName, password, email } = values

        if (!disableSubmit) {
            setSubmitting(true)
            const result = await signUp({ userName, password, email })

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
                    label={t('signup.userName')}
                    invalid={Boolean(errors.userName)}
                    errorMessage={errors.userName?.message}
                >
                    <Controller
                        name="userName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder={t('signup.userNamePH')}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('signup.email')}
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder={t('signup.emailPH')}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('signup.password')}
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder={t('signup.passwordPH')}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('signup.confirmPassword')}
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message}
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder={t('signup.confirmPasswordPH')}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? t('signup.submitting') : t('signup.submit')}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
