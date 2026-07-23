import ApiService from './ApiService'

export type CreateUserPayload = {
    first_name: string
    last_name?: string
    email: string
    phone?: string
    role: 'client' | 'owner' | 'admin'
    verified?: boolean
    send_welcome_email?: boolean
}

export type CreatedUser = {
    id: string
    first_name: string
    last_name: string | null
    email: string
    role: string
    status: string
}

export const createUser = async (data: CreateUserPayload) => {
    return ApiService.fetchDataWithAxios<CreatedUser>({
        url: '/users/create',
        method: 'POST',
        data,
    })
}
