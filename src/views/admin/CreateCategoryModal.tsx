import { useEffect, useState } from 'react'
import {
    createCategory,
    searchCategories,
    type CreateCategoryPayload,
} from '@/services/categoriesServices'

import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { Category } from '@/@types/category'
import { useTranslation } from 'react-i18next'

type Props = {
    isOpen: boolean
    onClose: () => void
    onSuccess: (category: Category) => void
    initialParentId?: string | null
}

type Option = {
    id: string
    name: string
    slug: string
}

type TypeCategory = 'parent' | 'sub'
type ApiError = {
    response?: {
        status?: number
        data?: {
            errors?: Record<string, string>
        }
    }
}
const normalizeSlug = (text: string) =>
    text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

const CreateCategoryModal = ({
    isOpen,
    onClose,
    onSuccess,
    initialParentId,
}: Props) => {
    const { t } = useTranslation()
    const [type, setType] = useState<TypeCategory>('parent')

    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [icon, setIcon] = useState('🎉')
    const [description, setDescription] = useState('')

    const [parent, setParent] = useState<Option | null>(null)
    const [parentSearch, setParentSearch] = useState('')
    const [parentOptions, setParentOptions] = useState<Option[]>([])

    const [loading, setLoading] = useState(false)

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        setSlug(normalizeSlug(name))
    }, [name])

    useEffect(() => {
        if (initialParentId) {
            setType('sub')
            setParent({
                id: initialParentId,
                name: '',
                slug: '',
            })
        }
    }, [initialParentId])

    useEffect(() => {
        if (!parentSearch || type !== 'sub') return

        const delay = setTimeout(async () => {
            try {
                const response = await searchCategories(parentSearch)
                setParentOptions((response as Option[]) ?? [])
            } catch (err) {
                console.error('searchCategories error:', err)
            }
        }, 300)

        return () => clearTimeout(delay)
    }, [parentSearch, type])

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})

        const payload: CreateCategoryPayload = {
            name,
            slug,
            icon,
            description,
            parent_id: type === 'sub' ? (parent?.id ?? null) : null,
            visibility: {
                show_on_homepage: false,
                show_in_search: true,
                allow_new_businesses: true,
                featured_on_homepage: false,
            },
        }

        try {
            const res = await createCategory(payload)

            toast.push(
                <Notification type="success">
                    {t('createCategoryModal.created')}
                </Notification>,
                { placement: 'top-center' },
            )

            onSuccess(res)
            onClose()

            setName('')
            setSlug('')
            setIcon('🎉')
            setDescription('')
            setParent(null)
            setParentSearch('')
            setType('parent')
        } catch (err: unknown) {
            console.error('createCategory error:', err)

            const error = err as ApiError

            if (error.response?.status === 422) {
                const backendErrors = error.response?.data?.errors ?? {}
                setErrors(backendErrors)
                return
            }

            toast.push(
                <Notification type="danger">
                    {t('createCategoryModal.error')}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[650px] rounded-xl bg-white p-6 shadow-xl">
                <h2 className="text-lg font-bold mb-4">
                    {t('createCategoryModal.title')}
                </h2>

                <div className="mb-4">
                    <label className="text-sm font-medium">
                        {t('createCategoryModal.type')}
                    </label>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <button
                            onClick={() => setType('parent')}
                            className={`p-3 border rounded-lg text-left ${
                                type === 'parent'
                                    ? 'border-black bg-gray-100'
                                    : ''
                            }`}
                        >
                            {t('createCategoryModal.parent')}
                        </button>

                        <button
                            onClick={() => setType('sub')}
                            className={`p-3 border rounded-lg text-left ${
                                type === 'sub' ? 'border-black bg-gray-100' : ''
                            }`}
                        >
                            {t('createCategoryModal.subcategory')}
                        </button>
                    </div>
                </div>

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm mb-1"
                    placeholder={t('createCategoryModal.name')}
                />
                {errors.name && (
                    <p className="text-red-500 text-xs mb-2">{errors.name}</p>
                )}

                <div className="grid grid-cols-2 gap-3 mb-1">
                    <input
                        value={slug}
                        onChange={(e) => setSlug(normalizeSlug(e.target.value))}
                        className="border rounded-lg p-2 text-sm"
                        placeholder={t('createCategoryModal.slug')}
                    />

                    <input
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className="border rounded-lg p-2 text-sm"
                        placeholder={t('createCategoryModal.icon')}
                    />
                </div>
                {errors.slug && (
                    <p className="text-red-500 text-xs mb-2">{errors.slug}</p>
                )}

                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm mb-3"
                    placeholder={t('createCategoryModal.description')}
                />
                {errors.description && (
                    <p className="text-red-500 text-xs mb-2">
                        {errors.description}
                    </p>
                )}

                {type === 'sub' && (
                    <div className="mb-3">
                        <input
                            value={parentSearch}
                            onChange={(e) => setParentSearch(e.target.value)}
                            className="w-full border rounded-lg p-2 text-sm"
                            placeholder={t('createCategoryModal.searchParent')}
                        />

                        {parentOptions.length > 0 && (
                            <div className="border rounded mt-1 max-h-40 overflow-auto">
                                {parentOptions.map((opt) => (
                                    <div
                                        key={opt.id}
                                        onClick={() => {
                                            setParent(opt)
                                            setParentSearch(opt.name)
                                            setParentOptions([])
                                        }}
                                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        {opt.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="border px-3 py-1.5 rounded-lg"
                    >
                        {t('createCategoryModal.cancel')}
                    </button>

                    <button
                        disabled={!name || loading}
                        onClick={handleSubmit}
                        className="bg-black text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
                    >
                        {loading
                            ? t('createCategoryModal.creating')
                            : t('createCategoryModal.create')}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateCategoryModal
