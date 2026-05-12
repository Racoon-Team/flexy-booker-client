import React from 'react'
import { useSessionUser, getToken } from '@/store/authStore'
import type { AxiosError } from 'axios'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

const unauthorizedCode = [401, 419, 440]

const showToast = (
    title: string,
    type: 'danger' | 'warning' | 'success' | 'info',
    message: string,
) => {
    toast.push(
        React.createElement(
            Notification,
            {
                title,
                type,
            },
            message,
        ),
        {
            placement: 'top-center',
        },
    )
}

const AxiosResponseIntrceptorErrorCallback = (error: AxiosError) => {
    const { response } = error
    const { setToken } = getToken()

    const message = (response?.data as { message?: string })?.message

    if (!response) {
        showToast(
            'Network Error',
            'danger',
            'Unable to connect to server',
        )

        return
    }

    if (
        unauthorizedCode.includes(response.status) &&
        response.config.url !== '/auth/login'
    ) {
        setToken('')
        useSessionUser.getState().setUser({})
        useSessionUser.getState().setSessionSignedIn(false)

        showToast(
            'Session Expired',
            'danger',
            'Please login again',
        )

        return
    }

    switch (response.status) {
        case 403:
            showToast(
                'Forbidden',
                'danger',
                message || 'Insufficient privileges',
            )
            break

        case 404:
            showToast(
                'Not Found',
                'warning',
                'Resource not found',
            )
            break

        case 500:
            showToast(
                'Server Error',
                'danger',
                message || 'Internal server error',
            )
            break
    }
}

export default AxiosResponseIntrceptorErrorCallback