import { getCategories } from '@/services/categoriesServices'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Category = {
    id: string
    name: string
    children?: Category[]
}

const CategoriesView = () => {
    const { t } = useTranslation()

    const [categories, setCategories] = useState<Category[]>([])

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    )
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
                        {t('categoriesView.admin')}
                    </p>

                    <h1 className="text-3xl font-bold italic text-gray-900">
                        {t('categoriesView.title', {
                            parents: parentCount,
                            subcategories: subcategoryCount,
                        })}
                    </h1>
                </div>

                <div className="flex gap-3">
                    <button className="rounded-lg border border-gray-300 px-4 py-2">
                        {t('categoriesView.reorder')}
                    </button>

                    <button className="rounded-lg bg-black px-4 py-2 text-white">
                        {t('categoriesView.newCategory')}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <aside className="w-[340px] min-w-[340px] overflow-y-auto border-r border-gray-200">
                    <div className="p-4">
                        <ul>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <div
                                        onClick={() => setSelectedCategory(cat)}
                                        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                                    >
                                        {cat.name}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {selectedCategory ? (
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {selectedCategory.name}
                                </h2>

                                <p className="text-gray-600 mt-2">
                                    {t('categoriesView.categoryId', {
                                        id: selectedCategory.id,
                                    })}
                                </p>
                            </div>
                        ) : (
                            <div className="text-gray-500">
                                {t('categoriesView.selectCategory')}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default CategoriesView
