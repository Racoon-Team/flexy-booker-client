import { useTranslation } from 'react-i18next'

type Service = {
    id: number
    name: string
    description: string
    price: number
    schedule: string[]
}

type Props = {
    service: Service
    onDelete: (id: number) => void
}

const ServiceItem = ({ service, onDelete }: Props) => {
    const { t } = useTranslation()

    return (
        <div>
            <h2 className="font-semibold text-lg">{service.name}</h2>

            <p className="text-gray-600 text-sm">
                {t('servicesView.services.description')}:{service.description}
            </p>

            <p className="text-gray-600 text-sm">
                {t('servicesView.services.availability')}:{service.price},{' '}
                {service.schedule}
            </p>

            <div className="flex gap-2 mt-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    {t('common.buttons.edit')}
                </button>

                <button
                    onClick={() => onDelete(service.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    {t('common.buttons.delete')}
                </button>
            </div>

            <hr className="mt-4" />
        </div>
    )
}

export default ServiceItem
