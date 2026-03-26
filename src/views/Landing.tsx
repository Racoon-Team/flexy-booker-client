import LandingNavbar from '@/components/template/LandingNavbar'
import { useTranslation } from 'react-i18next'

const services = [
    {
        id: 1,
        title: 'Sports Courts',
        description:
            'Find and book soccer, tennis, basketball courts and more.',
    },
    {
        id: 2,
        title: 'Nail Salons',
        description:
            'Book your appointment for manicures, pedicures and other nail services.',
    },
    {
        id: 3,
        title: 'Hair Salons',
        description:
            'Find your ideal stylist and book your next haircut or hairstyle.',
    },
    {
        id: 4,
        title: 'Accommodation Booking',
        description: 'Book your accommodation.',
    },
    {
        id: 5,
        title: 'Private Movie Rooms',
        description: 'Book private movie screenings.',
    },
    {
        id: 6,
        title: 'Pet Daycare',
        description: 'Book care for your pet.',
    },
]

const Landing = () => {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <LandingNavbar />

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                    {t('landing.exploreServices')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-lg font-semibold text-gray-800">
                                {service.title}
                            </h3>
                            <p className="text-gray-500 text-sm flex-1">
                                {service.description}
                            </p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm font-medium">
                                {t('landing.showOptionsBtn')}
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-sm text-gray-500">
                {t('landing.copyright')}
            </footer>
        </div>
    )
}

export default Landing
