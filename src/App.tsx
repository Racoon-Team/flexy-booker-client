import { BrowserRouter } from 'react-router'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts/Layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import { ModalProvider } from './components/modal/ModalProvider'

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
    return (
        <Theme>
            <BrowserRouter>
                <AuthProvider>
                    <ModalProvider>
                        <Layout>
                            <Views />
                        </Layout>
                    </ModalProvider>
                </AuthProvider>
            </BrowserRouter>
        </Theme>
    )
}

export default App
