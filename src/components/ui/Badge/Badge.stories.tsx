import type { Meta, StoryObj } from '@storybook/react'
import Badge from './Badge'

const meta: Meta<typeof Badge> = {
    title: 'UI/Badge',
    component: Badge,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Badge>

export const WithCount: Story = {
    args: {
        content: 5,
    },
}

export const MaxCount: Story = {
    args: {
        content: 150,
        maxCount: 99,
    },
}

export const Dot: Story = {
    args: {},
}

export const WithChildren: Story = {
    render: (args) => (
        <Badge {...args}>
            <button className="btn btn-default">Notifications</button>
        </Badge>
    ),
    args: {
        content: 3,
    },
}
