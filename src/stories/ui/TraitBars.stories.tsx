import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TraitBars, { getIdealTraits } from '@/components/TraitBars';

const meta = {
  title: 'UI/TraitBars',
  component: TraitBars,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    showValues: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TraitBars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Explorer: Story = {
  args: { traits: getIdealTraits('basic'), color: '#3B82F6' },
};

export const Architect: Story = {
  args: { traits: getIdealTraits('specDriven'), color: '#8B5CF6' },
};

export const Engineer: Story = {
  args: { traits: getIdealTraits('harness'), color: '#F59E0B' },
};

export const Commander: Story = {
  args: { traits: getIdealTraits('multiAgent'), color: '#EF4444' },
};

export const Scholar: Story = {
  args: { traits: getIdealTraits('academic'), color: '#10B981' },
};

export const Visionary: Story = {
  args: { traits: getIdealTraits('outcome'), color: '#EC4899' },
};

export const WithoutValues: Story = {
  args: { traits: getIdealTraits('harness'), color: '#F59E0B', showValues: false },
};
