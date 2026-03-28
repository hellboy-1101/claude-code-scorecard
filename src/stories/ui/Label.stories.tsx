import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'ラベル' },
};

export const WithInput: Story = {
  render: () => (
    <div className="grid gap-2 w-[300px]">
      <Label htmlFor="name">名前</Label>
      <Input id="name" placeholder="山田太郎" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid gap-2 w-[300px]" data-disabled>
      <Label>無効なラベル</Label>
      <Input disabled placeholder="無効" />
    </div>
  ),
};
