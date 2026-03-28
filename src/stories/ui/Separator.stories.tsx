import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Separator } from '@/components/ui/separator';

const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px]">
      <p className="text-sm">上のテキスト</p>
      <Separator className="my-4" />
      <p className="text-sm">下のテキスト</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>項目1</span>
      <Separator orientation="vertical" />
      <span>項目2</span>
      <Separator orientation="vertical" />
      <span>項目3</span>
    </div>
  ),
};
