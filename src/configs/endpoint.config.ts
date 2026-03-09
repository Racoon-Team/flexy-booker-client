export const apiPrefix = 'http://localhost:3000/api'

const endpointConfig = {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    signUp: '/auth/register',

    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
}

export default endpointConfig
