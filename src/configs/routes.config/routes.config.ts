import authRoute from './authRoute'
import othersRoute from './othersRoute'
import adminRoute from './adminRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [...othersRoute]

export const adminRoutes: Routes = [...adminRoute]
