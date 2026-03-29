import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TypeSelector from '@/components/TypeSelector';

const meta = {
  title: 'Components/TypeSelector',
  component: TypeSelector,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof TypeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultScores = {
  basic: 3,
  specDriven: 5,
  harness: 8,
  multiAgent: 2,
  academic: 1,
  outcome: 4,
};

export const Default: Story = {
  args: {
    inferredType: 'harness',
    scores: defaultScores,
    onSelect: (typeId: string) => console.log('Selected:', typeId),
    onBack: () => console.log('Back'),
  },
};

export const BasicType: Story = {
  args: {
    inferredType: 'basic',
    scores: { basic: 9, specDriven: 2, harness: 1, multiAgent: 0, academic: 0, outcome: 0 },
    onSelect: (typeId: string) => console.log('Selected:', typeId),
    onBack: () => console.log('Back'),
  },
};

export const OutcomeType: Story = {
  args: {
    inferredType: 'outcome',
    scores: { basic: 1, specDriven: 2, harness: 3, multiAgent: 2, academic: 1, outcome: 7 },
    onSelect: (typeId: string) => console.log('Selected:', typeId),
    onBack: () => console.log('Back'),
  },
};
