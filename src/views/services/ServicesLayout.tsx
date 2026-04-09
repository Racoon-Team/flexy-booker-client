import { Outlet } from 'react-router'
import LandingNavbar from '@/components/template/LandingNavbar'
import SidebarServices from './components/SidebarServices'


const ServicesLayout = () => {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <LandingNavbar />

            <div className="flex flex-1">
                <SidebarServices />

                <main className="flex-1 p-10 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default ServicesLayout