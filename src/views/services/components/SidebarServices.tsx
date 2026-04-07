import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router'

const SidebarServices = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const active = location.pathname

    return (
        <aside className="w-64 bg-white border-r border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4">
                {t('servicesView.sidebar.title')}
            </h2>

            <ul className="space-y-2">
                <li>
                    <button
                        onClick={() => navigate('/services')}
                        className={`w-full text-left px-4 py-2 rounded ${
                            active.startsWith('/services')
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {t('servicesView.sidebar.services')}
                    </button>
                </li>

                <li>
                    <button
                        onClick={() => navigate('/reservations')}
                        className={`w-full text-left px-4 py-2 rounded ${
                            active.startsWith('/reservations')
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {t('servicesView.sidebar.bookings')}
                    </button>
                </li>

                <li>
                    <button
                        onClick={() => navigate('/settings')}
                        className={`w-full text-left px-4 py-2 rounded ${
                            active.startsWith('/settings')
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {t('servicesView.sidebar.settings')}
                    </button>
                </li>
            </ul>
        </aside>
    )
}

export default SidebarServices
