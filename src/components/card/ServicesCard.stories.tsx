import type { Meta, StoryObj } from '@storybook/react'
import '@/locales'
import ServicesCard from './ServicesCard'

const meta: Meta<typeof ServicesCard> = {
    title: 'UI/ServicesCard',
    component: ServicesCard,
}

export default meta

type Story = StoryObj<typeof ServicesCard>

export const Default: Story = {
    args: {
        title: 'Cleaning Service',
        description: 'Professional home cleaning service',
        price: 25,
        rating: 4.5,
        verified: true,
    },
}

export const Verified: Story = {
    args: {
        title: 'Premium Service',
        description: 'Verified professional',
        price: 29,
        rating: 5.0,
        verified: true,
    },
}

export const NotVerified: Story = {
    args: {
        title: 'Standard Service',
        description: 'Non verified professional',
        price: 20,
        rating: 4.0,
        verified: false,
    },
}
