import ApiService from '@/services/ApiService'

export type User = {
    id: string
    first_name: string
    last_name: string | null
    email: string
    role: string
    status: string
    created_at: string
}

export const getUsers = async () => {
    return ApiService.fetchDataWithAxios<User[]>({
        url: '/users',
        method: 'GET',
    })
}