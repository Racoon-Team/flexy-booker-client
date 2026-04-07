import axios, { AxiosResponse } from 'axios'

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 50000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

export const setToken = (token: string | null) => {
    if (token) {
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete http.defaults.headers.common['Authorization']
    }
}

const responseBody = <T>(response: AxiosResponse<T>) => response.data

const httpServices = {
    get: <T>(url: string, params?: unknown) =>
        http.get<T>(url, { params }).then(responseBody),

    post: <T>(url: string, body?: unknown, headers?: unknown) =>
        http.post<T>(url, body, headers).then(responseBody),

    put: <T>(url: string, body?: unknown) =>
        http.put<T>(url, body).then(responseBody),

    delete: <T>(url: string) =>
        http.delete<T>(url).then(responseBody),
}

export default httpServices