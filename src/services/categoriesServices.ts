import ApiService from './ApiService'

export type Category = {
    id: string
    name: string
    slug: string
    icon: string | null
    status: string
    sort_order: number
    business_count: number
    children: Category[]
}
export const getCategories = async () => {
    return ApiService.fetchDataWithAxios<Category[]>({
        url: '/categories/tree',
        method: 'GET',
    })
}
