import { useTranslation } from 'react-i18next'

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
        <div
            onClick={onClick}
            className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
            <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0" />

            <div className="flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

                {rating && <p className="text-sm text-gray-700">{rating}</p>}

                <p className="text-sm text-gray-500">{description}</p>

                {price && (
                    <p className="text-sm text-gray-700">
                        {t('landing.currency')} {price}
                    </p>
                )}

                {verified && (
                    <span className="w-fit mt-1 text-xs border border-green-500 text-green-600 px-2 py-1 rounded-full">
                        {t('landing.verified')}
                    </span>
                )}
            </div>
        </div>
    )
}

export default ServicesCard
