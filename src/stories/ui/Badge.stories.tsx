import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from '@/components/ui/badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'デフォルト' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'セカンダリ' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'エラー' } };
export const Outline: Story = { args: { variant: 'outline', children: 'アウトライン' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'ゴースト' } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge>デフォルト</Badge>
      <Badge variant="secondary">セカンダリ</Badge>
      <Badge variant="destructive">エラー</Badge>
      <Badge variant="outline">アウトライン</Badge>
      <Badge variant="ghost">ゴースト</Badge>
      <Badge variant="link">リンク</Badge>
    </div>
  ),
};
