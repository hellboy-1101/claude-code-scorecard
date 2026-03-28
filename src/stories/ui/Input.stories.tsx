import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'テキストを入力...' },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid gap-2 w-[300px]">
      <Label htmlFor="email">メールアドレス</Label>
      <Input id="email" type="email" placeholder="example@example.com" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { placeholder: '無効', disabled: true },
};

export const Invalid: Story = {
  args: { placeholder: 'エラー', 'aria-invalid': true },
};

export const File: Story = {
  args: { type: 'file' },
};
