import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/auth'

const LandingNavbar = () => {
    const { authenticated, signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
    }

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">
                    ReservaYa
                </span>

                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Inicio
                    </Link>

                    {authenticated && (
                        <Link
                            to="/reservations"
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            Mis Reservas
                        </Link>
                    )}

                    {authenticated ? (
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                            onClick={handleSignOut}
                        >
                            Cerrar Sesión
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                onClick={() => navigate('/sign-in')}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                onClick={() => navigate('/sign-up')}
                            >
                                Registrarse
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default LandingNavbar
