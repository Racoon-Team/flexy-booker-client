import { Navigate, Outlet } from 'react-router'
import appConfig from '@/configs/app.config'
import { useAuth } from '@/auth'
import { ADMIN } from '@/constants/roles.constant'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
    const { authenticated, user } = useAuth()

    if (!authenticated) {
        return <Outlet />
    }

    const entryPath = user.authority?.includes(ADMIN)
        ? '/admin'
        : authenticatedEntryPath

    return <Navigate to={entryPath} />
}

export default PublicRoute
