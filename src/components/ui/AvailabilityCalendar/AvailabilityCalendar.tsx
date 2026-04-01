import { useState, useEffect } from 'react'

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const HOURS: string[] = []

for (let i = 0; i < 24; i++) {
    if (i === 0) {
        HOURS.push('12 AM')
    } else if (i < 12) {
        HOURS.push(`${i} AM`)
    } else if (i === 12) {
        HOURS.push('12 PM')
    } else {
        HOURS.push(`${i - 12} PM`)
    }
}

function createCellId(dayIndex: number, hourIndex: number): string {
    return `${dayIndex}-${hourIndex}`
}

export interface AvailabilityCalendarProps {
    onChange?: (selectedCells: string[]) => void
}

export default function AvailabilityCalendar({
    onChange,
}: AvailabilityCalendarProps) {
    const [selectedCells, setSelectedCells] = useState<string[]>([])

    const [isDragging, setIsDragging] = useState(false)

    const [dragStartDay, setDragStartDay] = useState<number | null>(null)
    const [dragStartHour, setDragStartHour] = useState<number | null>(null)

    const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select')

    useEffect(() => {
        function handleMouseUp() {
            setIsDragging(false)
        }

        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    useEffect(() => {
        if (onChange) {
            onChange(selectedCells)
        }
    }, [selectedCells, onChange])

    function handleMouseDown(dayIndex: number, hourIndex: number) {
        const cellId = createCellId(dayIndex, hourIndex)

        const cellIsAlreadySelected = selectedCells.includes(cellId)

        if (cellIsAlreadySelected) {
            setDragMode('deselect')
        } else {
            setDragMode('select')
        }

        setIsDragging(true)
        setDragStartDay(dayIndex)
        setDragStartHour(hourIndex)

        if (cellIsAlreadySelected) {
            setSelectedCells((previous) =>
                previous.filter((id) => id !== cellId),
            )
        } else {
            setSelectedCells((previous) => [...previous, cellId])
        }
    }

    function handleMouseEnter(dayIndex: number, hourIndex: number) {
        if (!isDragging) return

        if (dragStartDay === null || dragStartHour === null) return

        if (dayIndex !== dragStartDay) return

        const firstHour = Math.min(dragStartHour, hourIndex)
        const lastHour = Math.max(dragStartHour, hourIndex)

        const cellsInRange: string[] = []

        for (let h = firstHour; h <= lastHour; h++) {
            cellsInRange.push(createCellId(dayIndex, h))
        }

        if (dragMode === 'select') {
            setSelectedCells((previous) => {
                const newCells = cellsInRange.filter(
                    (id) => !previous.includes(id),
                )
                return [...previous, ...newCells]
            })
        } else {
            setSelectedCells((previous) =>
                previous.filter((id) => !cellsInRange.includes(id)),
            )
        }
    }

    function isCellSelected(dayIndex: number, hourIndex: number): boolean {
        const cellId = createCellId(dayIndex, hourIndex)
        return selectedCells.includes(cellId)
    }

    return (
        <div className="select-none overflow-auto max-h-[420px] rounded-lg border border-gray-200">
            <table className="w-full border-collapse text-sm min-w-[500px]">
                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                    <tr>
                        <th className="w-14 p-2" />
                        {DAYS.map((dayName) => (
                            <th
                                key={dayName}
                                className="p-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide"
                            >
                                {dayName}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {HOURS.map((hourLabel, hourIndex) => (
                        <tr key={hourLabel}>
                            <td className="pr-3 text-right text-xs text-gray-400 whitespace-nowrap align-middle w-14">
                                {hourLabel}
                            </td>
                            {DAYS.map((_, dayIndex) => {
                                const isSelected = isCellSelected(
                                    dayIndex,
                                    hourIndex,
                                )
                                const cellColor = isSelected
                                    ? 'bg-green-200 hover:bg-green-300'
                                    : 'bg-white hover:bg-green-50'

                                return (
                                    <td
                                        key={dayIndex}
                                        className={`border border-gray-100 cursor-pointer h-8 transition-colors duration-75 ${cellColor}`}
                                        onDragStart={(e) => e.preventDefault()}
                                        onMouseDown={() =>
                                            handleMouseDown(dayIndex, hourIndex)
                                        }
                                        onMouseEnter={() =>
                                            handleMouseEnter(
                                                dayIndex,
                                                hourIndex,
                                            )
                                        }
                                    />
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
