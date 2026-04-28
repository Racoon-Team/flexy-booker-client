import axios from 'axios'
import AxiosResponseIntrceptorErrorCallback from './AxiosResponseIntrceptorErrorCallback'
import appConfig from '@/configs/app.config'
import { useToken } from '@/store/authStore'
import type { AxiosError } from 'axios'

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiPrefix,
})

AxiosBase.interceptors.request.use(
    (config) => {
        const { token } = useToken()

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

AxiosBase.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        AxiosResponseIntrceptorErrorCallback(error)
        return Promise.reject(error)
    },
)

export default AxiosBase