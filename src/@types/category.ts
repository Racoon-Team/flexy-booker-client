export type Category = {
    id: string
    name: string
    slug: string
    icon?: string | null
    description?: string | null
    status: string
    sort_order: number
    business_count: number
    children: Category[]
    parent_id?: string | null
}

export type CreateCategoryPayload = {
    name: string
    slug: string
    icon?: string | null
    description?: string | null
    parent_id?: string | null
}