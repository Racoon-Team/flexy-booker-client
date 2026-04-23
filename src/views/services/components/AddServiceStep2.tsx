import { useState } from 'react'
import { AvailabilityCalendar } from '@/components/ui'
import type { CustomField } from './addServiceTypes'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()

    function handleSubmit() {
        if (schedule.length === 0) {
            setLocalError(t('servicesView.addService.errors.scheduleRequired'))
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
                    {t('modal.cancel')}
                </button>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                    >
                        {t('servicesView.addService.buttons.back')}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting
                            ? t('servicesView.addService.buttons.saving')
                            : t('servicesView.addService.buttons.save')}
                    </button>
                </div>
            </div>
        </div>
    )
}
