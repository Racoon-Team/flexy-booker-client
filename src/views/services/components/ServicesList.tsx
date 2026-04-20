import ServiceItem from './ServiceItem'

type Service = {
    id: number
    name: string
    description: string
    price: number
    schedule: string[]
}
type Props = {
    services: Service[]
    onDelete: (id: number) => void
}

const ServicesList = ({ services, onDelete }: Props) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
            {Array.isArray(services) &&
                services.map((service) => (
                    <ServiceItem
                        key={service.id}
                        service={service}
                        onDelete={onDelete}
                    />
                ))}
        </div>
    )
}

export default ServicesList
