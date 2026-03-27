import { useState } from 'react'
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
    companyNumber: string
    address: string
    acceptTerms: boolean
}

const ClientSignUpForm = (props: ClientSignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props

    const { t } = useTranslation()
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { signUp } = useAuth()

    const validationSchema = z
        .object({
            fullName: z.string().min(1, {
                message: t('signupBusiness.errors.fullName'),
            }),
            email: z.string().email({
                message: t('signupBusiness.errors.email'),
            }),
            password: z.string().min(6, {
                message: t('signupBusiness.errors.password'),
            }),
            confirmPassword: z.string().min(1, {
                message: t('signupBusiness.errors.confirmPassword'),
            }),
            companyNumber: z.string().min(1, {
                message: t('signupBusiness.errors.companyNumber'),
            }),
            address: z.string().min(1, {
                message: t('signupBusiness.errors.address'),
            }),
            acceptTerms: z.boolean().refine((val) => val === true, {
                message: t('signupBusiness.errors.acceptTerms'),
            }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('signupBusiness.errors.passwordMatch'),
            path: ['confirmPassword'],
        })

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
            companyNumber: '',
            address: '',
        },
    })

    const onSignUp = async (values: ClientSignUpFormSchema) => {
        const { fullName, email, password, companyNumber, address } = values
        console.log(companyNumber, address)

        if (!disableSubmit) {
            setSubmitting(true)

            const result = await signUp({
                userName: fullName,
                email,
                password,
                address,
                phoneNumber: companyNumber,
                userType: 'empresa',
            })
            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }

            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignUp)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                        label={t('signupBusiness.fullName')}
                        invalid={Boolean(errors.fullName)}
                        errorMessage={errors.fullName?.message}
                    >
                        <Controller
                            name="fullName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder={t('signupBusiness.fullNamePH')}
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t('signupBusiness.email')}
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    placeholder={t('signupBusiness.emailPH')}
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t('signupBusiness.password')}
                        invalid={Boolean(errors.password)}
                        errorMessage={errors.password?.message}
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="password"
                                    placeholder={t('signupBusiness.passwordPH')}
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t('signupBusiness.confirmPassword')}
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
                                        'signupBusiness.confirmPasswordPH',
                                    )}
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label={t('signupBusiness.companyNumber')}
                        invalid={Boolean(errors.companyNumber)}
                        errorMessage={errors.companyNumber?.message}
                    >
                        <Controller
                            name="companyNumber"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder={t(
                                        'signupBusiness.companyNumberPH',
                                    )}
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label={t('signupBusiness.address')}
                        invalid={Boolean(errors.address)}
                        errorMessage={errors.address?.message}
                    >
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder={t('signupBusiness.addressPH')}
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
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
                                {t('signupBusiness.acceptTerms')}
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
                        ? t('signupBusiness.submitting')
                        : t('signupBusiness.submit')}
                </Button>
            </Form>
        </div>
    )
}

export default ClientSignUpForm
