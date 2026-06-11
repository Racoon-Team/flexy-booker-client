import { HiChevronRight, HiChevronDown } from 'react-icons/hi'
import type { Category } from '@/services/categoriesServices'
import { useTranslation } from 'react-i18next'

export type { Category }

const TreeSkeleton = () => (
    <div className="animate-pulse space-y-2 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2 py-1">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div
                    className="h-4 bg-gray-200 rounded"
                    style={{ width: `${50 + i * 10}%` }}
                />
                <div className="w-8 h-4 bg-gray-200 rounded ml-auto" />
            </div>
        ))}
    </div>
)

const TreeNode = ({
    node,
    depth,
    selectedId,
    expandedIds,
    onSelect,
    onToggle,
}: {
    node: Category
    depth: number
    selectedId: string | null
    expandedIds: Set<string>
    onSelect: (node: Category) => void
    onToggle: (id: string) => void
}) => {
    const isExpanded = expandedIds.has(node.id)
    const isSelected = selectedId === node.id
    const isArchived = node.status === 'archived'
    const hasChildren = node.children && node.children.length > 0

    return (
        <div>
            <div
                className={`
                    flex items-center gap-1 py-1.5 cursor-pointer rounded-lg mx-1
                    ${isSelected ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}
                    ${isArchived ? 'opacity-40' : ''}
                `}
                style={{
                    paddingLeft: `${12 + depth * 16}px`,
                    paddingRight: '12px',
                }}
                onClick={() => onSelect(node)}
            >
                <button
                    className={`w-4 h-4 flex-shrink-0 ${!hasChildren ? 'invisible' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggle(node.id)
                    }}
                >
                    {isExpanded ? (
                        <HiChevronDown className="w-4 h-4" />
                    ) : (
                        <HiChevronRight className="w-4 h-4" />
                    )}
                </button>

                {node.icon && (
                    <span className="text-base leading-none flex-shrink-0">
                        {node.icon}
                    </span>
                )}

                <span
                    className={`flex-1 text-sm truncate ${isSelected ? 'font-medium' : ''}`}
                >
                    {node.name}
                </span>

                <span
                    className={`
                    text-xs px-1.5 py-0.5 rounded-full flex-shrink-0
                    ${isSelected ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-500'}
                `}
                >
                    {node.business_count}
                </span>
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            selectedId={selectedId}
                            expandedIds={expandedIds}
                            onSelect={onSelect}
                            onToggle={onToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

type CategoryTreeProps = {
    categories: Category[]
    loading: boolean
    selectedId: string | null
    expandedIds: Set<string>
    onSelect: (node: Category) => void
    onToggle: (id: string) => void
}

const CategoryTree = ({
    categories,
    loading,
    selectedId,
    expandedIds,
    onSelect,
    onToggle,
}: CategoryTreeProps) => {
    const { t } = useTranslation()

    if (loading) return <TreeSkeleton />
    if (!categories.length) {
        return (
            <div className="p-4 text-sm text-gray-500">
                {t('categoriesView.noResults')}
            </div>
        )
    }
    return (
        <div>
            {categories.map((node) => (
                <TreeNode
                    key={node.id}
                    node={node}
                    depth={0}
                    selectedId={selectedId}
                    expandedIds={expandedIds}
                    onSelect={onSelect}
                    onToggle={onToggle}
                />
            ))}
        </div>
    )
}

export default CategoryTree
