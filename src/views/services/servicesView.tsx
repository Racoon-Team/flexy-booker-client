import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import ServicesHeader from './components/ServicesHeader'
import ServicesList from './components/ServicesList'
import Pagination from '../../components/Pagination'
import { getServices, deleteService } from './servicesServices'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import type { Service } from './components/addServiceTypes'
import AddServiceForm from './components/AddServiceForm'
import { useModal } from '@/components/modal/ModalProvider'
import Skeleton from '@/components/ui/Skeleton'
import NoDataFound from '@/assets/svg/NoDataFound'

const ServicesView = () => {
    const { t } = useTranslation()
    const { openModal } = useModal()
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selected, setSelected] = useState<Service | null>(null)

    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const [services, setServices] = useState<Service[]>([])

    const indexOfLast = currentPage * itemsPerPage
    const indexOfFirst = indexOfLast - itemsPerPage
    const currentServices = services.slice(indexOfFirst, indexOfLast)

    const totalPages = Math.ceil(services.length / itemsPerPage)

    const fetchServices = async () => {
        setLoading(true)
        try {
            const data = await getServices()
            setServices(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    const handleEdit = (service: Service) => {
        openModal({
            content: (
                <AddServiceForm
                    initialService={service}
                    onSuccess={fetchServices}
                />
            ),
        })
    }

    const handleDelete = (service: Service) => {
        setSelected(service)
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selected) return

        try {
            await deleteService(selected.id)
            setServices((prev) => prev.filter((s) => s.id !== selected.id))
            toast.push(
                <Notification type="success">
                    {t('servicesView.delete.success', { name: selected.name })}
                </Notification>,
            )
        } catch (error) {
            console.error(error)
            toast.push(
                <Notification type="danger">
                    {t('servicesView.delete.error', { name: selected.name })}
                </Notification>,
            )
        }

        setConfirmOpen(false)
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100">
            <div className="flex flex-1">
                <main className="flex-1 p-10 bg-gray-50">
                    <>
                        <ServicesHeader onServiceAdded={fetchServices} />
                        {loading ? (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton height={22} width="40%" />
                                        <Skeleton height={16} width="70%" />
                                        <Skeleton height={16} width="30%" />
                                        <Skeleton height={16} width="55%" />
                                        <div className="flex gap-2 mt-2">
                                            <Skeleton height={30} width={60} />
                                            <Skeleton height={30} width={60} />
                                        </div>
                                        {i < 4 && <hr className="mt-4" />}
                                    </div>
                                ))}
                            </div>
                        ) : services.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
                                <NoDataFound />
                                <p>{t('servicesView.services.empty')}</p>
                            </div>
                        ) : (
                            <>
                                <ServicesList
                                    services={currentServices}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                />
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    setCurrentPage={setCurrentPage}
                                />
                            </>
                        )}
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
