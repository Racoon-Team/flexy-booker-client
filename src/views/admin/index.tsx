import type { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'
import { HiExclamation, HiTrendingUp } from 'react-icons/hi'

const kpiCards = [
    { label: 'Usuarios totales', value: '12.412', trend: '↑ 8% mes' },
    { label: 'Negocios activos', value: '1.248', trend: '↑ 12% mes' },
    { label: 'Reseñas (30d)', value: '4.182', sub: '3 reportadas' },
    { label: 'Mensajes (30d)', value: '28.9k', trend: '↑ 22%' },
]

const attentionItems = [
    {
        title: '3 reportes de abuso sin revisar',
        sub: 'El más antiguo: hace 2 días',
        action: 'Revisar →',
    },
    {
        title: '8 negocios pendientes de verificación',
        sub: 'Documentos subidos · esperando aprobación',
        action: 'Verificar →',
    },
    {
        title: '12 reseñas con baja confianza (antispam)',
        sub: 'Auto-detectadas · revisar manualmente',
        action: 'Ver lista →',
    },
]

const topCities = [
    { city: 'La Paz', users: 4820, biz: 72 },
    { city: 'Santa Cruz', users: 3940, biz: 58 },
    { city: 'Cochabamba', users: 2160, biz: 42 },
    { city: 'Sucre', users: 980, biz: 21 },
    { city: 'El Alto', users: 512, biz: 15 },
]

const chartCategories = [
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
    'Ene',
    'Feb',
]

const usuariosData = [
    320, 410, 380, 460, 500, 420, 550, 580, 610, 590, 640, 700, 750, 780, 820,
    870, 920, 1050, 1200, 1350,
]
const negociosData = [
    80, 95, 88, 110, 120, 100, 130, 140, 150, 145, 160, 175, 185, 200, 220, 235,
    255, 290, 330, 370,
]

const chartOptions: ApexOptions = {
    chart: {
        type: 'bar',
        stacked: true,
        toolbar: { show: false },
        background: 'transparent',
    },
    colors: ['#1a1a1a', '#C97B5A'],
    plotOptions: {
        bar: { columnWidth: '72%', borderRadius: 1 },
    },
    xaxis: {
        categories: chartCategories,
        labels: { style: { fontSize: '9px', colors: '#999' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    legend: {
        position: 'bottom',
        markers: { size: 7 },
        labels: { colors: '#666' },
        fontSize: '12px',
    },
    dataLabels: { enabled: false },
    tooltip: { theme: 'light' },
}

const AdminView = () => {
    return (
        <div className="p-8 max-w-screen-xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="text-sm text-gray-500 mb-1">
                        Platform overview
                    </p>
                    <h1 className="text-4xl font-bold italic text-gray-900">
                        Salud de la plataforma
                    </h1>
                </div>
                <div className="flex items-center gap-3 mt-3">
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                        Últimos 30 días ▾
                    </button>
                    <button className="text-sm border border-gray-400 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-gray-100 transition-colors">
                        Exportar
                    </button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {kpiCards.map((kpi) => (
                    <div
                        key={kpi.label}
                        className="bg-white rounded-xl border border-gray-200 p-5"
                    >
                        <p className="text-sm text-gray-500 mb-2">
                            {kpi.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 tracking-tight">
                            {kpi.value}
                        </p>
                        {kpi.trend && (
                            <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                <HiTrendingUp className="text-green-500" />
                                {kpi.trend}
                            </p>
                        )}
                        {kpi.sub && (
                            <p className="text-xs text-gray-500 mt-1.5">
                                {kpi.sub}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Attention required */}
            <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-3">
                    Atención requerida
                </p>
                <div className="space-y-3">
                    {attentionItems.map((item) => (
                        <div
                            key={item.title}
                            className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4"
                        >
                            <div className="w-8 h-8 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center shrink-0">
                                <HiExclamation className="text-orange-500 text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                    {item.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {item.sub}
                                </p>
                            </div>
                            <button className="bg-gray-900 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors shrink-0">
                                {item.action}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-2 gap-4">
                {/* Growth chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm font-medium text-gray-700 mb-2 italic">
                        Crecimiento
                    </p>
                    <ReactApexChart
                        type="bar"
                        options={chartOptions}
                        series={[
                            { name: 'usuarios', data: usuariosData },
                            { name: 'negocios', data: negociosData },
                        ]}
                        height={260}
                    />
                </div>

                {/* Top cities */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm font-medium text-gray-700 mb-4 italic">
                        Top ciudades
                    </p>
                    <table className="w-full text-sm">
                        <tbody>
                            {topCities.map((row) => (
                                <tr
                                    key={row.city}
                                    className="border-b border-dashed border-gray-200 last:border-0"
                                >
                                    <td className="py-3 text-gray-800 font-medium">
                                        {row.city}
                                    </td>
                                    <td className="py-3 text-gray-500 text-right">
                                        {row.users.toLocaleString('es-BO')}
                                    </td>
                                    <td className="py-3 text-gray-400 text-right pl-6">
                                        {row.biz} biz
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminView
