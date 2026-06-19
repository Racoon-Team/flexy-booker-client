import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiX } from 'react-icons/hi'
import Tag from '@/components/ui/Tag'
import Spinner from '@/components/ui/Spinner'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import {
    addTagToCategory,
    removeTagFromCategory,
    searchTags,
    type Tag as TagType,
} from '@/services/categoriesServices'

type CategoryTagsEditorProps = {
    categoryId: string
    initialTags: TagType[]
}

const CategoryTagsEditor = ({
    categoryId,
    initialTags,
}: CategoryTagsEditorProps) => {
    const { t } = useTranslation()
    const [tags, setTags] = useState<TagType[]>(initialTags)
    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())
    const [adding, setAdding] = useState(false)
    const [showInput, setShowInput] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [suggestions, setSuggestions] = useState<TagType[]>([])
    const [searching, setSearching] = useState(false)

    const handleRemove = async (tagId: string) => {
        setRemovingIds((prev) => new Set(prev).add(tagId))

        try {
            await removeTagFromCategory(categoryId, tagId)
            setTags((prev) => prev.filter((tag) => tag.id !== tagId))
        } catch (error) {
            console.error('Failed to remove tag', error)
            toast.push(
                <Notification type="danger">
                    {t('categoriesView.tags.removeError')}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setRemovingIds((prev) => {
                const next = new Set(prev)
                next.delete(tagId)
                return next
            })
        }
    }

    const handleAdd = async (name: string) => {
        const trimmed = name.trim()
        if (!trimmed) return

        setAdding(true)
        try {
            const newTag = await addTagToCategory(categoryId, trimmed)

            setTags((prev) =>
                prev.some((tag) => tag.id === newTag.id)
                    ? prev
                    : [...prev, newTag],
            )
            setInputValue('')
            setSuggestions([])
            setShowInput(false)
        } catch (error) {
            console.error('Failed to add tag', error)
            toast.push(
                <Notification type="danger">
                    {t('categoriesView.tags.addError')}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setAdding(false)
        }
    }

    const handleInputChange = async (value: string) => {
        setInputValue(value)
        if (!value.trim()) {
            setSuggestions([])
            return
        }
        setSearching(true)
        try {
            const results = await searchTags(value.trim())
            setSuggestions(results)
        } catch {
            setSuggestions([])
        } finally {
            setSearching(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAdd(inputValue)
        }
        if (e.key === 'Escape') {
            setShowInput(false)
            setInputValue('')
            setSuggestions([])
        }
    }

    return (
        <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
                {t('categoriesView.tags.label')}
            </p>

            <div className="flex flex-wrap gap-2 items-center">
                {tags.map((tag) => {
                    const isRemoving = removingIds.has(tag.id)
                    return (
                        <Tag
                            key={tag.id}
                            className="flex items-center gap-1 px-2 py-1"
                        >
                            <span className={isRemoving ? 'opacity-50' : ''}>
                                {tag.name}
                            </span>
                            {isRemoving ? (
                                <Spinner size={14} />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleRemove(tag.id)}
                                    className="ml-1 text-gray-400 hover:text-gray-700"
                                >
                                    <HiX className="w-3 h-3" />
                                </button>
                            )}
                        </Tag>
                    )
                })}

                {showInput ? (
                    <div className="relative">
                        <input
                            autoFocus
                            type="text"
                            value={inputValue}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={() => {
                                setTimeout(() => setShowInput(false), 150)
                            }}
                            placeholder={t('categoriesView.tags.inputPh')}
                            className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        />

                        {(searching || suggestions.length > 0) && (
                            <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                {searching ? (
                                    <div className="p-2 flex justify-center">
                                        <Spinner size={16} />
                                    </div>
                                ) : (
                                    suggestions.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onMouseDown={() =>
                                                handleAdd(s.name)
                                            }
                                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100"
                                        >
                                            {s.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowInput(true)}
                        disabled={adding}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 px-2 py-1"
                    >
                        {adding ? (
                            <Spinner size={14} />
                        ) : (
                            t('categoriesView.tags.addBtn')
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

export default CategoryTagsEditor
