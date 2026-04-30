import type { Meta, StoryObj } from '@storybook/react-vite';
import LogoButton from './LogoButton';

/** Google "G" logo (official brand colors) */
const GoogleIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27H12.255v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.88Z"
      fill="#4285F4"
    />
    <path
      d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.01c-1.07.72-2.44 1.15-4.05 1.15-3.12 0-5.76-2.11-6.7-4.94H1.575v3.11A11.995 11.995 0 0 0 12.255 24Z"
      fill="#34A853"
    />
    <path
      d="M5.555 14.29A7.2 7.2 0 0 1 5.175 12c0-.8.14-1.57.38-2.29V6.6H1.575A11.995 11.995 0 0 0 .255 12c0 1.94.46 3.77 1.32 5.4l3.98-3.11Z"
      fill="#FBBC05"
    />
    <path
      d="M12.255 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C18.195 1.19 15.485 0 12.255 0A11.995 11.995 0 0 0 1.575 6.6l3.98 3.11c.94-2.83 3.58-4.94 6.7-4.94Z"
      fill="#EA4335"
    />
  </svg>
);

/** GitHub octocat mark */
const GitHubIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#0F172A" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const meta = {
  title: 'Components/LogoButton',
  component: LogoButton,
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'text',
      description: 'Tailwind width class',
    },
    height: {
      control: 'text',
      description: 'Tailwind height class',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    title: 'Google',
    icon: GoogleIcon,
    onPress: () => console.log('LogoButton clicked'),
    disabled: false,
  },
} satisfies Meta<typeof LogoButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WideGitHub: Story = {
  args: {
    title: 'Continuar con GitHub',
    icon: GitHubIcon,
    width: 'w-65',
    height: 'h-12',
  },
};

export const IconOnly: Story = {
  args: {
    title: '',
    icon: GoogleIcon,
    width: 'w-12',
    height: 'h-12',
  },
};
