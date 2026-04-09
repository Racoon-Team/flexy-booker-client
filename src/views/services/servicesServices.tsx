import httpServices from '@/services/api/httpServices'

type Service = {
    id: number
    name: string
    description: string
    price: number
    schedule: string[]
}

export const getServices = async (): Promise<Service[]> => {
    return httpServices.get<Service[]>('/api/services')
}