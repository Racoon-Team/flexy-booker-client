import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router'
import {
    HiViewGrid,
    HiCalendar,
    HiCog,
    HiChevronLeft,
    HiChevronRight,
} from 'react-icons/hi'

const NAV_ITEMS = [
    { path: '/services', icon: HiViewGrid, labelKey: 'servicesView.sidebar.services' },
    { path: '/reservations', icon: HiCalendar, labelKey: 'servicesView.sidebar.bookings' },
    { path: '/settings', icon: HiCog, labelKey: 'servicesView.sidebar.settings' },
]

const SidebarServices = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)

    const active = location.pathname

    return (
        <aside
            className={`relative flex flex-col bg-white border-r border-gray-200 transition-all duration-200 ${
                collapsed ? 'w-14' : 'w-64'
            }`}
        >
            {!collapsed && (
                <div className="p-4">
                    <h2 className="text-lg font-semibold truncate">
                        {t('servicesView.sidebar.title')}
                    </h2>
                </div>
            )}

            <ul className="space-y-1 px-2">
                {NAV_ITEMS.map(({ path, icon: Icon, labelKey }) => {
                    const isActive = active.startsWith(path)
                    return (
                        <li key={path}>
                            <button
                                onClick={() => navigate(path)}
                                title={collapsed ? t(labelKey) : undefined}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                } ${collapsed ? 'justify-center' : ''}`}
                            >
                                <Icon className="text-lg flex-shrink-0" />
                                {!collapsed && (
                                    <span className="text-sm">{t(labelKey)}</span>
                                )}
                            </button>
                        </li>
                    )
                })}
            </ul>

            <div className={`mt-auto p-2 border-t border-gray-200 flex ${collapsed ? 'justify-center' : 'justify-end'}`}>
                <button
                    onClick={() => setCollapsed((c) => !c)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? (
                        <HiChevronRight className="text-lg" />
                    ) : (
                        <HiChevronLeft className="text-lg" />
                    )}
                </button>
            </div>
        </aside>
    )
}

export default SidebarServices
