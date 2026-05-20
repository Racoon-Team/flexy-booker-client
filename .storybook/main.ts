import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
    addons: ['@storybook/addon-essentials'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    viteFinal(config) {
        config.resolve = {
            ...config.resolve,
            alias: {
                ...((config.resolve?.alias as Record<string, string>) ?? {}),
                '@': path.resolve(__dirname, '../src'),
            },
        }
        return config
    },
}

export default config
