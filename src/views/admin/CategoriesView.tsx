import CategoryTree from '@/components/ui/CategoryTree'
import type { Category } from '@/components/ui/CategoryTree'
import {
    getCategories,
    getCategoryStats,
    type CategoryStats,
} from '@/services/categoriesServices'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const normalizeText = (text: string) =>
    text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

const filterCategories = (
    categories: Category[],
    search: string,
): Category[] => {
    const normalizedSearch = normalizeText(search)

    return categories.reduce<Category[]>((acc, category) => {
        const matches = normalizeText(category.name).includes(normalizedSearch)

        const filteredChildren = category.children
            ? filterCategories(category.children, search)
            : []

        if (matches || filteredChildren.length > 0) {
            acc.push({
                ...category,
                children: filteredChildren,
            })
        }

        return acc
    }, [])
}

const getExpandedIdsForSearch = (
    categories: Category[],
    search: string,
): Set<string> => {
    const expanded = new Set<string>()
    const normalizedSearch = normalizeText(search)

    const visit = (node: Category): boolean => {
        const selfMatches = normalizeText(node.name).includes(normalizedSearch)

        const childMatches =
            node.children?.some((child) => visit(child)) ?? false

        if (childMatches) {
            expanded.add(node.id)
        }

        return selfMatches || childMatches
    }

    categories.forEach((category) => visit(category))

    return expanded
}
const CategoriesView = () => {
    const { t } = useTranslation()

    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<CategoryStats | null>(null)
    const [statsLoading, setStatsLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    )

    const EXPANDED_IDS_KEY = 'categories_expanded_ids'

    const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
        try {
            const stored = sessionStorage.getItem(EXPANDED_IDS_KEY)
            return stored ? new Set(JSON.parse(stored)) : new Set()
        } catch {
            return new Set()
        }
    })

    const [searchTerm, setSearchTerm] = useState('')

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
    useEffect(() => {
        if (!selectedCategory) {
            setStats(null)
            return
        }

        const loadStats = async () => {
            setStatsLoading(true)

            try {
                const data = await getCategoryStats(selectedCategory.id)
                setStats(data)
            } catch (error) {
                console.error('Error loading stats', error)
            } finally {
                setStatsLoading(false)
            }
        }

        loadStats()
    }, [selectedCategory])
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
            sessionStorage.setItem(
                EXPANDED_IDS_KEY,
                JSON.stringify(Array.from(next)),
            )
            return next
        })
    }
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) {
            return categories
        }

        return filterCategories(categories, searchTerm)
    }, [categories, searchTerm])

    const searchExpandedIds = useMemo(() => {
        if (!searchTerm.trim()) {
            return expandedIds
        }

        return getExpandedIdsForSearch(categories, searchTerm)
    }, [categories, searchTerm, expandedIds])

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
                    <div className="px-3 pb-3">
                        <input
                            type="text"
                            placeholder={t('categoriesView.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <CategoryTree
                        categories={filteredCategories}
                        loading={loading}
                        selectedId={selectedCategory?.id ?? null}
                        expandedIds={searchExpandedIds}
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

                                <p className="mt-2 text-gray-600">
                                    {t('categoriesView.categoryId', {
                                        id: selectedCategory.id,
                                    })}
                                </p>

                                {statsLoading ? (
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        {[1, 2].map((item) => (
                                            <div
                                                key={item}
                                                className="h-28 animate-pulse rounded-lg border border-gray-200 bg-gray-100"
                                            />
                                        ))}
                                    </div>
                                ) : stats ? (
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <p className="text-sm text-gray-500">
                                                {t('categoriesView.businesses')}
                                            </p>

                                            <p className="mt-2 text-3xl font-bold">
                                                {stats.businesses.total}
                                            </p>

                                            {stats.businesses.delta !==
                                                null && (
                                                <p className="mt-2 text-sm text-green-600">
                                                    ↑ {stats.businesses.delta}{' '}
                                                    {
                                                        stats.businesses
                                                            .delta_label
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="rounded-lg border border-gray-200 p-4">
                                            <p className="text-sm text-gray-500">
                                                {t('categoriesView.servicesListed')}
                                            </p>

                                            <p className="mt-2 text-3xl font-bold">
                                                {stats.services_listed.total}
                                            </p>

                                            {stats.services_listed.delta !==
                                                null && (
                                                <p className="mt-2 text-sm text-green-600">
                                                    ↑{' '}
                                                    {
                                                        stats.services_listed
                                                            .delta
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : null}
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
