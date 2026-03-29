import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProgressBar from '@/components/ProgressBar';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    current: { control: { type: 'number', min: 1, max: 8 } },
    total: { control: { type: 'number', min: 1, max: 10 } },
    color: { control: 'color' },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { current: 3, total: 8 },
};

export const WithColor: Story = {
  args: { current: 5, total: 8, color: '#8B5CF6' },
};

export const Complete: Story = {
  args: { current: 8, total: 8 },
};

export const AllSteps: Story = {
  args: { current: 1, total: 8 },
  render: () => (
    <div className="space-y-16 pt-8 px-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="relative">
          <span className="text-sm text-gray-500">Step {i + 1} / 8</span>
          <ProgressBar current={i + 1} total={8} />
        </div>
      ))}
    </div>
  ),
};
