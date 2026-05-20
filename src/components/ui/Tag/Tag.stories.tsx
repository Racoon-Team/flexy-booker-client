import type { Meta, StoryObj } from '@storybook/react'
import Tag from './Tag'

const meta: Meta<typeof Tag> = {
    title: 'UI/Tag',
    component: Tag,
    tags: ['autodocs'],
    argTypes: {
        prefix: { control: 'boolean' },
        suffix: { control: 'boolean' },
    },
}

export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = {
    args: {
        children: 'Tag label',
    },
}

export const WithPrefix: Story = {
    args: {
        children: 'With prefix',
        prefix: true,
    },
}

export const WithSuffix: Story = {
    args: {
        children: 'With suffix',
        suffix: true,
    },
}

export const Custom: Story = {
    args: {
        children: 'Custom class',
        className: 'bg-primary text-white border-primary',
    },
}
