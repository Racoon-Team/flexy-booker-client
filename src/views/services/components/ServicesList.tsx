import ServiceItem from './ServiceItem'
import type { Service } from './addServiceTypes'
type Props = {
    services: Service[]
    onDelete: (service: Service) => void
    onEdit: (service: Service) => void
}
const ServicesList = ({ services, onDelete, onEdit }: Props) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
            {Array.isArray(services) &&
                services.map((service) => (
                    <ServiceItem
                        key={service.id}
                        service={service}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
        </div>
    )
}

export default ServicesList
