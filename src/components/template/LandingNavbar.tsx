import { useAuth } from '@/auth'
import { useLocaleStore } from '@/store/localeStore'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

const LANGUAGES = [
    { value: 'en', label: '🇺🇸 EN' },
    { value: 'es', label: '🇧🇴 ES' },
]

const LandingNavbar = () => {
    const { authenticated, signOut } = useAuth()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { currentLang, setLang } = useLocaleStore()

    const handleSignOut = async () => {
        await signOut()
    }

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
            <div className="w-full flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">
                    ReservaYa
                </span>

                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        {t('landing.navbar.home')}
                    </Link>

                    {authenticated && (
                        <Link
                            to="/reservations"
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            {t('landing.navbar.myReservations')}
                        </Link>
                    )}

                    <select
                        value={currentLang}
                        onChange={(e) => setLang(e.target.value)}
                        className="text-sm text-gray-600 bg-transparent border border-gray-200 rounded-lg px-2 py-1 cursor-pointer hover:border-blue-400 focus:outline-none focus:border-blue-500 transition-colors"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>

                    {authenticated ? (
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                            onClick={handleSignOut}
                        >
                            {t('landing.navbar.logoutBtn')}
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                onClick={() => navigate('/sign-in')}
                            >
                                {t('landing.navbar.loginBtn')}
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                onClick={() => navigate('/sign-up')}
                            >
                                {t('landing.navbar.registerBtn')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default LandingNavbar
