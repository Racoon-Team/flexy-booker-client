import { useTranslation } from 'react-i18next'

type Service = {
    id: number
    name: string
    description: string
    date: string
    time: string
}

const ServicesList = ({ services }: { services: Service[] }) => {
    const { t } = useTranslation()

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
            {services.map((service) => (
                <div key={service.id}>
                    <h2 className="font-semibold text-lg">
                        {service.name}
                    </h2>

                    <p className="text-gray-600 text-sm">
                        {t('servicesView.services.description')}:
                        {service.description}
                    </p>

                    <p className="text-gray-600 text-sm">
                        {t('servicesView.services.availability')}:
                        {service.date}, {service.time}
                    </p>

                    <div className="flex gap-2 mt-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            {t('common.buttons.edit')}
                        </button>

                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                            {t('common.buttons.delete')}
                        </button>
                    </div>

                    <hr className="mt-4" />
                </div>
            ))}
        </div>
    )
}

export default ServicesList