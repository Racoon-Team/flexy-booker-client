import ApiService from './ApiService'

export type Category = {
    id: string
    name: string
    children?: Category[]
}

export const getCategories = async () => {
    return ApiService.fetchDataWithAxios<Category[]>({
        url: '/categories/tree',
        method: 'GET',
    })
}
