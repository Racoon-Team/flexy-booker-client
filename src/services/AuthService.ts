import ApiService from './ApiService';
import endpointConfig, { apiPrefix } from '@/configs/endpoint.config';
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
} from '@/@types/auth';

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: apiPrefix + endpointConfig.signIn,
        method: 'post',
        data,
    });
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchDataWithAxios<SignUpResponse>({
        url: apiPrefix + endpointConfig.signUp,
        method: 'post',
        data,
    });
}

export async function apiSignOut() {
    return ApiService.fetchDataWithAxios({
        url: apiPrefix + endpointConfig.signOut,
        method: 'post',
    });
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.forgotPassword,
        method: 'post',
        data,
    });
}

export async function apiResetPassword<T>(data: ResetPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.resetPassword,
        method: 'post',
        data,
    });
}
