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
export type CategoryDetail = {
    id: string
    name: string
    slug: string
    icon: string | null
    status: string
    sort_order: number
    parent: { id: string; name: string; slug: string } | null
    visibility: {
        show_on_homepage: boolean
        show_in_search: boolean
        allow_new_businesses: boolean
        featured_on_homepage: boolean
    }
    tags: { id: string; name: string; slug: string }[]
    created_at: string
    updated_at: string
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
export const getCategoryById = async (id: string) => {
    return ApiService.fetchDataWithAxios<CategoryDetail>({
        url: `/categories/${id}`,
        method: 'GET',
    })
}

export const updateCategory = async (
    id: string,
    data: Record<string, unknown>,
) => {
    return ApiService.fetchDataWithAxios<CategoryDetail>({
        url: `/categories/${id}`,
        method: 'PATCH',
        data,
    })
}

export const archiveCategory = async (id: string) => {
    return ApiService.fetchDataWithAxios<{ message: string; warning?: string }>(
        {
            url: `/categories/${id}/archive`,
            method: 'PATCH',
        },
    )
}

export const unarchiveCategory = async (id: string) => {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: `/categories/${id}/unarchive`,
        method: 'PATCH',
    })
}
