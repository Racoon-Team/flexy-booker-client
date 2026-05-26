import type { Routes } from '@/@types/routes'
import { ADMIN } from '@/constants/roles.constant'
import { lazy } from 'react'

const adminRoute: Routes = [
    {
        key: 'admin.dashboard',
        path: '/admin',
        component: lazy(() => import('@/views/admin')),
        authority: [ADMIN],
    },
    {
        key: 'admin.users',
        path: '/admin/users',
        component: lazy(() => import('@/views/admin/UsersView')),
        authority: [ADMIN],
    },
    {
        key: 'admin.businesses',
        path: '/admin/businesses',
        component: lazy(() => import('@/views/admin/BusinessesView')),
        authority: [ADMIN],
    },
    {
        key: 'admin.categories',
        path: '/admin/categories',
        component: lazy(() => import('@/views/admin/CategoriesView')),
        authority: [ADMIN],
    },
    {
        key: 'admin.reports',
        path: '/admin/reports',
        component: lazy(() => import('@/views/admin/ReportsView')),
        authority: [ADMIN],
    },
    {
        key: 'admin.activity',
        path: '/admin/activity',
        component: lazy(() => import('@/views/admin/ActivityView')),
        authority: [ADMIN],
    },
    {
        key: 'admin.settings',
        path: '/admin/settings',
        component: lazy(() => import('@/views/admin/AdminSettingsView')),
        authority: [ADMIN],
    },
    {
        key: 'admin.team',
        path: '/admin/team',
        component: lazy(() => import('@/views/admin/TeamView')),
        authority: [ADMIN],
    },
    {
        key: 'admin.audit',
        path: '/admin/audit',
        component: lazy(() => import('@/views/admin/AuditView')),
        authority: [ADMIN],
    },
]

export default adminRoute
