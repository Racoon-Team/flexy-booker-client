import { useState } from 'react'
import { AvailabilityCalendar } from '@/components/ui'
import type { CustomField } from './addServiceTypes'

type Props = {
    isSubmitting: boolean
    errorMessage: string
    onBack: () => void
    onCancel: () => void
    onSubmit: (schedule: string[], customFields: CustomField[]) => void
}

export default function AddServiceStep2({
    isSubmitting,
    errorMessage,
    onBack,
    onCancel,
    onSubmit,
}: Props) {
    const [schedule, setSchedule] = useState<string[]>([])
    const [localError, setLocalError] = useState('')

    function handleSubmit() {
        if (schedule.length === 0) {
            setLocalError('Please select at least one time slot')
            return
        }
        setLocalError('')
        onSubmit(schedule, [])
    }

    return (
        <div>
            <AvailabilityCalendar onChange={(cells) => setSchedule(cells)} />

            {(localError || errorMessage) && (
                <p className="text-red-500 text-sm mt-2">
                    {localError || errorMessage}
                </p>
            )}

            <div className="flex justify-between mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                >
                    Cancel
                </button>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Create / Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}
