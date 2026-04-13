import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import appConfig from '@/configs/app.config'

import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
} from '@/@types/auth'

const { apiPrefix } = appConfig

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: apiPrefix + endpointConfig.signIn,
        method: 'post',
        data,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchDataWithAxios<SignUpResponse>({
        url: apiPrefix + endpointConfig.signUp,
        method: 'post',
        data,
    })
}

export async function apiSignOut(userId: number) {
    return ApiService.fetchDataWithAxios({
        url: apiPrefix + endpointConfig.signOut,
        method: 'post',
        data: { userId },
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiPrefix + endpointConfig.forgotPassword,
        method: 'post',
        data,
    })
}

export async function apiResetPassword<T>(data: ResetPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: apiPrefix + endpointConfig.resetPassword,
        method: 'post',
        data,
    })
}