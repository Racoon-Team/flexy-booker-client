import LandingNavbar from '@/components/template/LandingNavbar'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const ServicesView = () => {
    const { t } = useTranslation()
    const [active, setActive] = useState('servicios')

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 2

    const servicios = [
        {
            id: 1,
            nombre: 'Consultoría IT',
            descripcion: 'Mantenimiento en infraestructuras.',
            fecha: '15/07/2024',
            hora: '10:00 AM - 12:00 PM',
        },
        {
            id: 2,
            nombre: 'Corte de Cabello',
            descripcion: 'Corte y estilo para caballeros.',
            fecha: '16/07/2024',
            hora: '02:00 PM - 05:00 PM',
        },
        {
            id: 3,
            nombre: 'Diseño Web',
            descripcion: 'Creación de páginas modernas.',
            fecha: '17/07/2024',
            hora: '09:00 AM - 11:00 AM',
        },
        {
            id: 4,
            nombre: 'Soporte Técnico',
            descripcion: 'Reparación de equipos.',
            fecha: '18/07/2024',
            hora: '01:00 PM - 03:00 PM',
        },
    ]

    const indexOfLast = currentPage * itemsPerPage
    const indexOfFirst = indexOfLast - itemsPerPage
    const currentServices = servicios.slice(indexOfFirst, indexOfLast)

    const totalPages = Math.ceil(servicios.length / itemsPerPage)

    return (
       <div className="min-h-screen flex flex-col bg-gray-100">
            <LandingNavbar />

            <div className="flex flex-1 w-full">
                <aside className="w-64 bg-white border-r border-gray-200 p-4">
                    <h2 className="text-lg font-semibold mb-4">
                        Panel de Control de Empresa
                    </h2>

                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActive('inicio')}
                                className={`w-full text-left px-4 py-2 rounded ${
                                    active === 'inicio'
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                Inicio
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => setActive('servicios')}
                                className={`w-full text-left px-4 py-2 rounded ${
                                    active === 'servicios'
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                Mis Servicios
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => setActive('reservas')}
                                className={`w-full text-left px-4 py-2 rounded ${
                                    active === 'reservas'
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                Mis Reservas
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => setActive('config')}
                                className={`w-full text-left px-4 py-2 rounded ${
                                    active === 'config'
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                Configuración
                            </button>
                        </li>
                    </ul>
                </aside>
                <main className="flex-1 w-full p-10 bg-gray-50">
                    {active === 'servicios' && (
                        <>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                                <h1 className="text-xl font-semibold">
                                    Mis Servicios y Horarios Actuales
                                </h1>

                                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Agregar Servicio
                                </button>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
                                {currentServices.map((servicio) => (
                                    <div key={servicio.id}>
                                        <h2 className="font-semibold text-lg"> 
                                        </h2>

                                        <p className="text-gray-600 text-sm">
                                            Descripción: {servicio.descripcion}
                                        </p>

                                        <p className="text-gray-600 text-sm">
                                            Disponibilidad: {servicio.fecha},{' '}
                                            {servicio.hora}
                                        </p>

                                        <div className="flex gap-2 mt-2">
                                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                                Editar
                                            </button>

                                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                                Eliminar
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
                                    Anterior
                                </button>

                                <span className="px-3 py-1">
                                    Página {currentPage} de {totalPages}
                                </span>

                                <button
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border rounded disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </>
                    )}

                    {active === 'inicio' && <h1>Inicio</h1>}
                    {active === 'reservas' && <h1>Mis Reservas</h1>}
                    {active === 'config' && <h1>Configuración</h1>}
                </main>
            </div>

             <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-sm text-gray-500">
                {t('landing.copyright')}
            </footer>
        </div>
    )
}

export default ServicesView
