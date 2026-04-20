import endpointConfig from '@/configs/endpoint.config'
import ApiService from '@/services/ApiService'

type Service = {
    id: number
    name: string
    description: string
    price: number
    schedule: string[]
}

export const getServices = async (): Promise<Service[]> => {
    return ApiService.fetchDataWithAxios<Service[]>({
        url: endpointConfig.services,
        method: 'get',
    })
}

export const deleteService = async (id: number) => {
    return ApiService.fetchDataWithAxios({
        url: `${endpointConfig.services}/${id}`,
        method: 'delete',
    })
}