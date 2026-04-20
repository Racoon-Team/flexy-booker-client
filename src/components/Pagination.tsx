import { useTranslation } from 'react-i18next'

type Props = {
    currentPage: number
    totalPages: number
    setCurrentPage: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, setCurrentPage }: Props) => {
    const { t } = useTranslation()

    return (
        <div className="flex justify-center mt-4 gap-2">
            <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                {t('common.buttons.previous')}
            </button>

            <span className="px-3 py-1">
                {t('servicesView.pagination.page', {
                    current: currentPage,
                    total: totalPages,
                })}
            </span>

            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                {t('common.buttons.next')}
            </button>
        </div>
    )
}

export default Pagination
