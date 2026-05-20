import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Business } from '@/@types/business'
import { useTranslation } from 'react-i18next'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (
    L.Icon.Default.prototype as typeof L.Icon.Default.prototype & {
        _getIconUrl: unknown
    }
)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
})

type Props = {
    points?: Business[]
    onSelectPoint?: (point: Business) => void
}

export default function Map({ points = [], onSelectPoint }: Props) {
    const { t } = useTranslation()
    const center: [number, number] =
        points.length > 0 ? [points[0].lat, points[0].lng] : [-17.783, -63.182]

    return (
        <MapContainer
            center={center}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {points.map((point) => (
                <Marker
                    key={point.id}
                    position={[point.lat, point.lng]}
                    eventHandlers={{
                        click: () => onSelectPoint?.(point),
                    }}
                >
                    <Popup>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                minWidth: '150px',
                                margin: '0',
                                padding: '0',
                            }}
                        >
                            <p style={{ margin: '0', fontWeight: '600' }}>
                                {point.name}
                            </p>
                            {point.rating && (
                                <p style={{ margin: '0', fontSize: '12px' }}>
                                    ⭐ {point.rating}
                                </p>
                            )}
                            {point.price_from && (
                                <p style={{ margin: '0', fontSize: '12px' }}>
                                    {t('landing.map.fromPrice')}{' '}
                                    {point.price_from} Bs
                                </p>
                            )}
                            <button
                                style={{
                                    marginTop: '4px',
                                    background: '#111',
                                    color: 'white',
                                    fontSize: '11px',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                }}
                            >
                                {t('landing.map.seeDetails')}
                            </button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
