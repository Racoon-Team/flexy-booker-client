import endpointConfig from '@/configs/endpoint.config'
import ApiService from '@/services/ApiService'
import type { Service } from './components/addServiceTypes'

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

export const updateService = async (
    id: number,
    payload: { name: string; description?: string; price?: number; schedule: string[] },
) => {
    return ApiService.fetchDataWithAxios({
        url: `${endpointConfig.services}/${id}`,
        method: 'put',
        data: payload,
    })
}