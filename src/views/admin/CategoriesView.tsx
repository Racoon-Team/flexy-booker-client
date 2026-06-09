import { getCategories } from '@/services/categoriesServices'
import { useEffect, useMemo, useState } from 'react'

type Category = {
    id: string
    name: string
    children?: Category[]
}

const CategoriesView = () => {
    const [categories, setCategories] = useState<Category[]>([])
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories()

                console.log('CATEGORIES:', data)

                setCategories(data)
            } catch (error) {
                console.error('Error loading categories', error)
            }
        }

        loadCategories()
    }, [])
    const parentCount = categories.length

    const subcategoryCount = useMemo(() => {
        return categories.reduce(
            (acc, category) => acc + (category.children?.length || 0),
            0,
        )
    }, [categories])

    return (
        <div className="flex h-full min-h-0 flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="mb-1 text-sm text-gray-500">
                        Admin · Categories
                    </p>

                    <h1 className="text-3xl font-bold italic text-gray-900">
                        Categories · {parentCount} parents · {subcategoryCount}{' '}
                        subcategories
                    </h1>
                </div>

                <div className="flex gap-3">
                    <button className="rounded-lg border border-gray-300 px-4 py-2">
                        Reorder
                    </button>

                    <button className="rounded-lg bg-black px-4 py-2 text-white">
                        + New Category
                    </button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <aside className="w-[340px] min-w-[340px] overflow-y-auto border-r border-gray-200">
                    <div className="p-4">Category Tree Placeholder</div>
                </aside>

                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">Category Detail Placeholder</div>
                </main>
            </div>
        </div>
    )
}

export default CategoriesView
