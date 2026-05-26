import PageContainer from '@/components/template/PageContainer'
import {
    adminRoutes,
    protectedRoutes,
    publicRoutes,
} from '@/configs/routes.config'
import AppRoute from './AppRoute'
import AuthorityGuard from './AuthorityGuard'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

import type { LayoutType } from '@/@types/theme'
import { useAuth } from '@/auth'
import { ADMIN, USER } from '@/constants/roles.constant'
import AdminLayout from '@/views/admin/AdminLayout'
import WorkInProgress from '@/views/WorkInProgress'
import ReservationsView from '@/views/services/ReservationsView'
import ServicesLayout from '@/views/services/ServicesLayout'
import ServicesView from '@/views/services/servicesView'
import SettingsView from '@/views/services/SettingsView'
import { Navigate, Route, Routes } from 'react-router'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const AllRoutes = (props: AllRoutesProps) => {
    const { user } = useAuth()

    return (
        <Routes>
            <Route path="/" element={<WorkInProgress />} />

            {/* User routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<ServicesLayout />}>
                    <Route
                        path="/services"
                        element={
                            <AuthorityGuard
                                userAuthority={user.authority}
                                authority={[USER]}
                            >
                                <ServicesView />
                            </AuthorityGuard>
                        }
                    />
                    <Route
                        path="/reservations"
                        element={
                            <AuthorityGuard
                                userAuthority={user.authority}
                                authority={[USER]}
                            >
                                <ReservationsView />
                            </AuthorityGuard>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <AuthorityGuard
                                userAuthority={user.authority}
                                authority={[USER]}
                            >
                                <SettingsView />
                            </AuthorityGuard>
                        }
                    />
                </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    {adminRoutes.map((route, index) => (
                        <Route
                            key={route.key + index}
                            path={route.path}
                            element={
                                <AuthorityGuard
                                    userAuthority={user.authority}
                                    authority={[ADMIN]}
                                >
                                    <PageContainer {...props} {...route.meta}>
                                        <AppRoute
                                            routeKey={route.key}
                                            component={route.component}
                                            {...route.meta}
                                        />
                                    </PageContainer>
                                </AuthorityGuard>
                            }
                        />
                    ))}
                </Route>
            </Route>

            <Route element={<PublicRoute />}>
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>

            <Route element={<ProtectedRoute />}>
                {protectedRoutes.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={
                            <AuthorityGuard
                                userAuthority={user.authority}
                                authority={route.authority}
                            >
                                <PageContainer {...props} {...route.meta}>
                                    <AppRoute
                                        routeKey={route.key}
                                        component={route.component}
                                        {...route.meta}
                                    />
                                </PageContainer>
                            </AuthorityGuard>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
        </Routes>
    )
}

export default AllRoutes
