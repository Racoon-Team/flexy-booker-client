import { useTranslation } from 'react-i18next'

type Service = {
    id: number
    name: string
    description: string
    price: number
    schedule: string[]
}

type Props = {
    service: Service
    onDelete: (id: number) => void
}

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const HOURS = Array.from({ length: 24 }, (_, i) => {
    if (i === 0) return '12 AM'
    if (i < 12) return `${i} AM`
    if (i === 12) return '12 PM'
    return `${i - 12} PM`
})

function formatSchedule(schedule: string[]): string {
    // Group cells by day
    const byDay: Record<number, number[]> = {}

    schedule.forEach((cell) => {
        const [day, hour] = cell.split('-').map(Number)
        if (!byDay[day]) byDay[day] = []
        byDay[day].push(hour)
    })

    const result: string[] = []

    Object.entries(byDay).forEach(([dayStr, hours]) => {
        const day = Number(dayStr)
        const sorted = [...hours].sort((a, b) => a - b)

        const ranges: { start: number; end: number }[] = []
        let rangeStart = sorted[0]
        let rangeEnd = sorted[0]

        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] === rangeEnd + 1) {
                rangeEnd = sorted[i]
            } else {
                ranges.push({ start: rangeStart, end: rangeEnd })
                rangeStart = sorted[i]
                rangeEnd = sorted[i]
            }
        }
        ranges.push({ start: rangeStart, end: rangeEnd })

        ranges.forEach(({ start, end }) => {
            result.push(`${DAYS[day]}: ${HOURS[start]} - ${HOURS[end]}`)
        })
    })

    return result.join(', ')
}

const ServiceItem = ({ service, onDelete }: Props) => {
    const { t } = useTranslation()

    return (
        <div>
            <h2 className="font-semibold text-lg">{service.name}</h2>

            <p className="text-gray-600 text-sm">
                {t('servicesView.services.description')}:{service.description}
            </p>

            <p className="text-gray-600 text-sm">
                {t('servicesView.services.availability')}:{service.price},{' '}
                {formatSchedule(service.schedule)}
            </p>

            <div className="flex gap-2 mt-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    {t('common.buttons.edit')}
                </button>

                <button
                    onClick={() => onDelete(service.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    {t('common.buttons.delete')}
                </button>
            </div>

            <hr className="mt-4" />
        </div>
    )
}

export default ServiceItem
