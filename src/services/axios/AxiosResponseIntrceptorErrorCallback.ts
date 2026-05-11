import React from 'react'
import { useSessionUser, getToken } from '@/store/authStore'
import type { AxiosError } from 'axios'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

const unauthorizedCode = [401, 419, 440]

const AxiosResponseIntrceptorErrorCallback = (error: AxiosError) => {
    const { response } = error
    const { setToken } = getToken()

    const message = (response?.data as { message?: string })?.message

    if (!response) {
        toast.push(
            React.createElement(
                Notification,
                {
                    title: 'Network Error',
                    type: 'danger',
                },
                'Unable to connect to server',
            ),
            {
                placement: 'top-center',
            },
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

        toast.push(
            React.createElement(
                Notification,
                {
                    title: 'Session Expired',
                    type: 'danger',
                },
                'Please login again',
            ),
            {
                placement: 'top-center',
            },
        )

        return
    }

    switch (response.status) {
        case 403:
            toast.push(
                React.createElement(
                    Notification,
                    {
                        title: 'Forbidden',
                        type: 'danger',
                    },
                    message || 'Insufficient privileges',
                ),
                {
                    placement: 'top-center',
                },
            )
            break

        case 404:
            toast.push(
                React.createElement(
                    Notification,
                    {
                        title: 'Not Found',
                        type: 'warning',
                    },
                    'Resource not found',
                ),
                {
                    placement: 'top-center',
                },
            )
            break

        case 500:
            toast.push(
                React.createElement(
                    Notification,
                    {
                        title: 'Server Error',
                        type: 'danger',
                    },
                    message || 'Internal server error',
                ),
                {
                    placement: 'top-center',
                },
            )
            break
    }
}

export default AxiosResponseIntrceptorErrorCallback
