import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import InterestSelector from '@/components/InterestSelector';

const meta = {
  title: 'Components/InterestSelector',
  component: InterestSelector,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof InterestSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSelect: (interestId: string) => console.log('Selected:', interestId),
    onBack: () => console.log('Back'),
  },
};
