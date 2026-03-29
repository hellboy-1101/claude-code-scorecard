import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SocialProof from '@/components/SocialProof';

const meta = {
  title: 'UI/SocialProof',
  component: SocialProof,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof SocialProof>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'py-4 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50',
  },
};
