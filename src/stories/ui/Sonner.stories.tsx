import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const meta = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Button onClick={() => toast('通知', { description: 'これはトースト通知です' })}>
      トーストを表示
    </Button>
  ),
};

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success('成功しました')}>
      成功トースト
    </Button>
  ),
};

export const Error: Story = {
  render: () => (
    <Button onClick={() => toast.error('エラーが発生しました')}>
      エラートースト
    </Button>
  ),
};
