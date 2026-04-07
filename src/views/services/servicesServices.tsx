import httpServices from '@/httpServices'

type Service = {
    id: number
    name: string
    description: string
    date: string
    time: string
}

export const getServices = async (): Promise<Service[]> => {
    return httpServices.get<Service[]>('/api/services')
}