import { useTranslation } from "react-i18next"


type ServicesCardProps = {
    title: string
    description: string
    price?: number
    rating?: number
    verified?: boolean
    onClick?: () => void
}

const ServicesCard = ({
    title,
    description,
    price,
    rating,
    verified,
    onClick,
}: ServicesCardProps) => {
    const { t } = useTranslation()

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-full h-40 bg-gray-200 rounded-lg" />

            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-800">
                    {title}
                </h3>

                <p className="text-gray-500 text-sm">
                    {description}
                </p>

                {rating && (
                    <p className="text-sm text-gray-600">
                         {rating}
                    </p>
                )}

                {price && (
                    <p className="text-sm font-medium text-gray-700">
                        {t('landing.currency')} {price}
                    </p>
                )}

                {verified && (
                    <span className="w-fit text-xs border border-green-500 text-green-600 px-2 py-1 rounded-full">
                        {t('landing.verified')}
                    </span>
                )}
            </div>

            <button
                onClick={onClick}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm font-medium"
            >
                {t('landing.showOptionsBtn')}
            </button>
        </div>
    )
}

export default ServicesCard