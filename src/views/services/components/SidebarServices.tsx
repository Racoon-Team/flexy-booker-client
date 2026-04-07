import { useTranslation } from 'react-i18next'

type Props = {
    active: string
    setActive: (value: string) => void
}

const SidebarServices = ({ active, setActive }: Props) => {
    const { t } = useTranslation()

    return (
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
    )
}

export default SidebarServices