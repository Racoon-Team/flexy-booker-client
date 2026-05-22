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

export const WithoutPrice: Story = {
    args: {
        title: 'Basic Cleaning',
        description: 'Simple cleaning service',
        price: 55,
        rating: 4.4,
        verified: true,
    },
}

export const Verified: Story = {
    args: {
        title: 'Premium Service',
        description: 'Verified professional',
        price: 29,
        rating: 5.5,
        verified: true,
    },
}
