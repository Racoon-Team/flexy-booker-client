import type { Meta, StoryObj } from '@storybook/react'
import '@/locales'
import AvailabilityCalendar from './AvailabilityCalendar'

const meta: Meta<typeof AvailabilityCalendar> = {
    title: 'UI/AvailabilityCalendar',
    component: AvailabilityCalendar,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
}

export default meta
type Story = StoryObj<typeof AvailabilityCalendar>

export const Empty: Story = {
    args: {
        initialValues: [],
        startingHour: 8,
    },
}

export const PreFilled: Story = {
    args: {
        initialValues: [
            '1-9', '1-10', '1-11',
            '3-9', '3-10', '3-11',
            '5-9', '5-10', '5-11',
        ],
        startingHour: 8,
    },
}

export const WithOnChange: Story = {
    args: {
        initialValues: [],
        startingHour: 0,
        onChange: (cells) => console.log('selected:', cells),
    },
}
