import LandingNavbar from '@/components/template/LandingNavbar'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

type Service = {
    id: number
    name: string
    description: string
    date: string
    time: string
}
const ServicesView = () => {
    const { t } = useTranslation()
    const [active, setActive] = useState('services')

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3
    const [services, setServices] = useState<Service[]>([])

    const indexOfLast = currentPage * itemsPerPage
    const indexOfFirst = indexOfLast - itemsPerPage
    const currentServices = services.slice(indexOfFirst, indexOfLast)

    const totalPages = Math.ceil(services.length / itemsPerPage)
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(
                    'http://localhost:3000/api/services',
                )

                const data = await response.json()

                setServices(data)
            } catch (error) {
                console.error('Error fetching services:', error)
            }
        }

        fetchServices()
    }, [])
    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100">
            <LandingNavbar />

            <div className="flex flex-1 w-full">
                <aside className="w-64 bg-white border-r border-gray-200 p-4">
                    <h2 className="text-lg font-semibold mb-4">
                        {t('servicesView.sidebar.title')}
                    </h2>

                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActive('home')}
                                className={`w-full text-left px-4 py-2 rounded ${
                                    active === 'home'
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {t('servicesView.sidebar.home')}
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => setActive('services')}
                                className={`w-full text-left px-4 py-2 rounded ${
                                    active === 'services'
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {t('servicesView.sidebar.services')}
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => setActive('bookings')}
                                className={`w-full text-left px-4 py-2 rounded ${
                                    active === 'bookings'
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {t('servicesView.sidebar.bookings')}
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => setActive('settings')}
                                className={`w-full text-left px-4 py-2 rounded ${
                                    active === 'settings'
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {t('servicesView.sidebar.settings')}
                            </button>
                        </li>
                    </ul>
                </aside>
                <main className="flex-1 w-full p-10 bg-gray-50">
                    {active === 'services' && (
                        <>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                                <h1 className="text-xl font-semibold">
                                    {t('servicesView.services.title')}
                                </h1>

                                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    {t('common.buttons.add')}
                                </button>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
                                {currentServices.map((service) => (
                                    <div key={service.id}>
                                        <h2 className="font-semibold text-lg">
                                            {service.name}
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            {t(
                                                'servicesView.services.description',
                                            )}
                                            : {service.description}
                                        </p>

                                        <p className="text-gray-600 text-sm">
                                            {t(
                                                'servicesView.services.availability',
                                            )}
                                            : {service.date}, {service.time}
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

                            <div className="flex justify-center mt-4 gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
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
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                >
                                    {t('common.buttons.next')}
                                </button>
                            </div>
                        </>
                    )}

                    {active === 'home' && (
                        <h1>{t('servicesView.sidebar.home')}</h1>
                    )}

                    {active === 'bookings' && (
                        <h1>{t('servicesView.sidebar.bookings')}</h1>
                    )}

                    {active === 'settings' && (
                        <h1>{t('servicesView.sidebar.settings')}</h1>
                    )}
                </main>
            </div>

            <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-sm text-gray-500">
                {t('landing.copyright')}
            </footer>
        </div>
    )
}

export default ServicesView
