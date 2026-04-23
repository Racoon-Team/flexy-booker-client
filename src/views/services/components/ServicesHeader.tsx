import { useTranslation } from 'react-i18next'
import { useModal } from '@/components/modal/ModalProvider'
import AddServiceForm from './AddServiceForm'

const ServicesHeader = () => {
    const { t } = useTranslation()
    const { openModal } = useModal()

    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-xl font-semibold">
                {t('servicesView.services.title')}
            </h1>

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => openModal({ content: <AddServiceForm /> })}
            >
                {t('common.buttons.add')}
            </button>
        </div>
    )
}

export default ServicesHeader
