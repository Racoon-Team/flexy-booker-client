import { Outlet } from 'react-router'
import LandingNavbar from '@/components/template/LandingNavbar'
import SidebarServices from './components/SidebarServices'


const ServicesLayout = () => {
    return (
        <div className="h-screen w-full flex flex-col overflow-hidden">
            <LandingNavbar />

            <div className="flex flex-1 overflow-hidden">
                <SidebarServices />

                <main className="flex-1 p-10 bg-gray-50 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default ServicesLayout