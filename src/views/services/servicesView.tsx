import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import ServicesHeader from './components/ServicesHeader'
import ServicesList from './components/ServicesList'
import Pagination from '../../components/Pagination'
import { getServices, deleteService } from './servicesServices'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

type Service = {
    id: number
    name: string
    description: string
    price: number
    schedule: string[]
}

const ServicesView = () => {
    const { t } = useTranslation()
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selected, setSelected] = useState<Service | null>(null)

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

    const handleDelete = (service: Service) => {
        setSelected(service)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selected) return

        try {
            await deleteService(selected.id)

            setServices((prev) => prev.filter((s) => s.id !== selected.id))
        } catch (error) {
            console.error(error)
        }

        setConfirmOpen(false)
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100">
            <div className="flex flex-1">
                <main className="flex-1 p-10 bg-gray-50">
                    <>
                        <ServicesHeader />
                        <ServicesList
                            services={currentServices}
                            onDelete={handleDelete}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </>
                </main>
            </div>

            <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-sm text-gray-500">
                {t('landing.copyright')}
            </footer>

            <ConfirmDialog
                isOpen={confirmOpen}
                type="danger"
                title={t('common.buttons.delete')}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
            >
                {t('servicesView.delete.confirm', {
                    name: selected?.name,
                })}
            </ConfirmDialog>
        </div>
    )
}

export default ServicesView
