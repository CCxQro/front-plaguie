import type { Meta, StoryObj } from '@storybook/react-vite';
import SolutionCard from './SolutionsCard';
import StatisticsIcon from '../SVGIcons/StatisticsIcon';

const meta: Meta<typeof SolutionCard> = {
  title: 'Components/SolutionsCard',
  component: SolutionCard,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    width: {
      control: 'text',
      description: 'Tailwind width class (e.g., w-1/2, w-full, w-88)',
    },
    height: {
      control: 'text',
      description: 'Tailwind height class (e.g., h-72, h-screen)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <StatisticsIcon />,
    title: 'Monitoreo en Tiempo Real',
    description: 'Sensores IoT y algoritmos de IA que detectan amenazas fitosanitarias antes de que afecten la rentabilidad de tu cosecha.',
    width: 'w-1/2',
  },
};

export const FullWidth: Story = {
  args: {
    icon: <StatisticsIcon />,
    title: 'Monitoreo en Tiempo Real',
    description: 'Sensores IoT y algoritmos de IA que detectan amenazas fitosanitarias antes de que afecten la rentabilidad de tu cosecha.',
    width: 'w-full',
  },
};

export const WithHeight: Story = {
  args: {
    icon: <StatisticsIcon />,
    title: 'Monitoreo en Tiempo Real',
    description: 'Sensores IoT y algoritmos de IA que detectan amenazas fitosanitarias antes de que afecten la rentabilidad de tu cosecha.',
    width: 'w-88',
    height: 'h-72',
  },
};
