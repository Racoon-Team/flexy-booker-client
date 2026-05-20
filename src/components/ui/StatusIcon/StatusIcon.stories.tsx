import type { Meta, StoryObj } from '@storybook/react'
import StatusIcon from './StatusIcon'

const meta: Meta<typeof StatusIcon> = {
    title: 'UI/StatusIcon',
    component: StatusIcon,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['success', 'info', 'warning', 'danger'],
        },
    },
}

export default meta
type Story = StoryObj<typeof StatusIcon>

export const Success: Story = {
    args: { type: 'success' },
}

export const Info: Story = {
    args: { type: 'info' },
}

export const Warning: Story = {
    args: { type: 'warning' },
}

export const Danger: Story = {
    args: { type: 'danger' },
}

export const AllTypes: Story = {
    render: () => (
        <div className="flex gap-4">
            <StatusIcon type="success" />
            <StatusIcon type="info" />
            <StatusIcon type="warning" />
            <StatusIcon type="danger" />
        </div>
    ),
}
