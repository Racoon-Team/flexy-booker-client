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
export type CategoryStats = {
    businesses: {
        total: number
        delta: number | null
        delta_label: string | null
    }
    services_listed: {
        total: number
        delta: number | null
    }
}
export const getCategories = async () => {
    return ApiService.fetchDataWithAxios<Category[]>({
        url: '/categories/tree',
        method: 'GET',
    })
}
export const getCategoryStats = async (id: string) => {
    return ApiService.fetchDataWithAxios<CategoryStats>({
        url: `/categories/${id}/stats`,
        method: 'GET',
    })
}
