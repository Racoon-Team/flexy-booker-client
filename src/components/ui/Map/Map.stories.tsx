import type { Meta, StoryObj } from '@storybook/react'
import '@/locales'
import Map from './Map'

const meta: Meta<typeof Map> = {
    title: 'UI/Map',
    component: Map,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div style={{ height: '500px', width: '100%' }}>
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof Map>

export const Empty: Story = {
    args: {
        points: [],
    },
}

export const WithPoints: Story = {
    args: {
        points: [
            {
                id: 1,
                name: 'Discoteca MoonLight',
                rating: 4.5,
                price_from: 50,
                lat: -17.783,
                lng: -63.182,
            },
            {
                id: 2,
                name: 'Club Eclipse',
                rating: 4.0,
                price_from: 45,
                lat: -17.79,
                lng: -63.175,
            },
            {
                id: 3,
                name: 'Bar Nocturno',
                rating: 3.8,
                price_from: 30,
                lat: -17.775,
                lng: -63.19,
            },
        ],
    },
}

export const WithOnSelectPoint: Story = {
    args: {
        points: [
            {
                id: 1,
                name: 'Discoteca MoonLight',
                rating: 4.5,
                price_from: 50,
                lat: -17.783,
                lng: -63.182,
            },
        ],
        onSelectPoint: (point) => console.log('selected:', point),
    },
}
