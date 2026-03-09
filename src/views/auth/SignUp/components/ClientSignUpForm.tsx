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

const validationSchema = z
    .object({
        fullName: z
            .string()
            .min(1, { message: 'Por favor ingresa tu nombre completo' }),
        email: z.email({ message: 'Por favor ingresa un correo válido' }),
        password: z.string().min(6, {
            message: 'La contraseña debe tener al menos 6 caracteres',
        }),
        confirmPassword: z
            .string()
            .min(1, { message: 'Por favor confirma tu contraseña' }),
        acceptTerms: z.boolean().refine((val) => val === true, {
            message: 'Debes aceptar los términos y condiciones',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    })

const ClientSignUpForm = (props: ClientSignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props

    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { signUp } = useAuth()

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ClientSignUpFormSchema>({
        resolver: zodResolver(validationSchema),
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
                    label="Nombre Completo"
                    invalid={Boolean(errors.fullName)}
                    errorMessage={errors.fullName?.message}
                >
                    <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Tu nombre completo"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Correo Electrónico"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder="tu@ejemplo.com"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Contraseña"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                placeholder="Contraseña"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Confirmar Contraseña"
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message}
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                placeholder="Confirmar contraseña"
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
                                Acepto los términos y condiciones
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
                    {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
            </Form>
        </div>
    )
}

export default ClientSignUpForm
