import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import InputField from './InputField';

const meta = {
    title: 'Components/InputField',
    component: InputField,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onChange: { action: 'changed' },
    },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        type: 'text',
        placeholder: 'Enter text',
        height: 'h-13',
        onChange: fn(),
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter password',
        height: 'h-13',
        onChange: fn(),
    },
};

export const WithValue: Story = {
    args: {
        type: 'text',
        placeholder: 'Enter text',
        height: 'h-13',
        onChange: fn(),
    },
};

export const LargeInput: Story = {
    args: {
        type: 'text',
        placeholder: 'Enter text',
        height: 'h-20',
        onChange: fn(),
    },
};