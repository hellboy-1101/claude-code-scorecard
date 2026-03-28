import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'ボタン' } };
export const Destructive: Story = { args: { variant: 'destructive', children: '削除' } };
export const Outline: Story = { args: { variant: 'outline', children: 'キャンセル' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'セカンダリ' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'ゴースト' } };
export const Link: Story = { args: { variant: 'link', children: 'リンク' } };

export const Small: Story = { args: { size: 'sm', children: '小' } };
export const Large: Story = { args: { size: 'lg', children: '大' } };

export const WithIcon: Story = {
  render: () => (
    <Button>
      <Mail /> メール送信
    </Button>
  ),
};

export const Disabled: Story = { args: { children: '無効', disabled: true } };
