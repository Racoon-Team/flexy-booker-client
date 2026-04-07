import LandingNavbar from '@/components/template/LandingNavbar'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

import SidebarServices from './components/SidebarServices'
import ServicesHeader from './components/ServicesHeader'
import ServicesList from './components/ServicesList'
import Pagination from './components/Pagination'
import { getServices } from './servicesServices'


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
                const data = await getServices()
                setServices(data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchServices()
    }, [])

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100">
            <LandingNavbar />

            <div className="flex flex-1">
                <SidebarServices active={active} setActive={setActive} />

                <main className="flex-1 p-10 bg-gray-50">
                    {active === 'home' && (
                        <h1>{t('servicesView.sidebar.home')}</h1>
                    )}

                    {active === 'bookings' && (
                        <h1>{t('servicesView.sidebar.bookings')}</h1>
                    )}

                    {active === 'settings' && (
                        <h1>{t('servicesView.sidebar.settings')}</h1>
                    )}

                    {active === 'services' && (
                        <>
                            <ServicesHeader />
                            <ServicesList services={currentServices} />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                            />
                        </>
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
