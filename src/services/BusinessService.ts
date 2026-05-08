import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'

export async function getMyBusiness() {
    return ApiService.fetchDataWithAxios<{
        id: number
        user_id: number
        business_name: string
        category: string
        description: string
    }>({
        method: 'get',
        url: `${endpointConfig.businesses}/me`,
    })
}

export async function createService(data: {
    business_id: number
    name: string
    description?: string
    price?: number
    schedule: string[]
    custom_fields?: object[]
}) {
    return ApiService.fetchDataWithAxios({
        method: 'post',
        url: endpointConfig.services,
        data,
    })
}
