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
    companyNumber: string
    address: string
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
        companyNumber: z.string().min(1, {
            message: 'Ingresa el número de empresa',
        }),
        address: z.string().min(1, {
            message: 'Ingresa la dirección',
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
            userType: "empresa",
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
                        label="Nombre del Negocio "
                        invalid={Boolean(errors.fullName)}
                        errorMessage={errors.fullName?.message}
                    >
                        <Controller
                            name="fullName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Nombre del Negocio"
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
                        label="Número de Empresa"
                        invalid={Boolean(errors.companyNumber)}
                        errorMessage={errors.companyNumber?.message}
                    >
                        <Controller
                            name="companyNumber"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Número de Empresa"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Dirección"
                        invalid={Boolean(errors.address)}
                        errorMessage={errors.address?.message}
                    >
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Dirección"
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
