import CategoryTree from '@/components/ui/CategoryTree'
import type { Category } from '@/components/ui/CategoryTree'
import { getCategories } from '@/services/categoriesServices'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CategoriesView = () => {
    const { t } = useTranslation()

    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    )
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

    const loadCategories = async () => {
        setLoading(true)
        try {
            const data = await getCategories()
            setCategories(data)
        } catch (error) {
            console.error('Error loading categories', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    const parentCount = categories.length

    const subcategoryCount = useMemo(() => {
        return categories.reduce(
            (acc, category) => acc + (category.children?.length || 0),
            0,
        )
    }, [categories])

    const handleToggle = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

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
                    <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
                        {t('categoriesView.reorder')}
                    </button>
                    <button className="rounded-lg bg-black px-4 py-2 text-white text-sm">
                        {t('categoriesView.newCategory')}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                <aside className="w-[340px] min-w-[340px] overflow-y-auto border-r border-gray-200 py-2">
                    <CategoryTree
                        categories={categories}
                        loading={loading}
                        selectedId={selectedCategory?.id ?? null}
                        expandedIds={expandedIds}
                        onSelect={setSelectedCategory}
                        onToggle={handleToggle}
                    />
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
