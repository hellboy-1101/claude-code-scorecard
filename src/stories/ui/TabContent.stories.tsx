import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TabContent from '@/components/TabContent';

const meta = {
  title: 'UI/TabContent',
  component: TabContent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 600 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TabContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      { value: 'overview', label: '概要', content: <p className="text-gray-700 dark:text-gray-300">概要タブの内容です。</p> },
      { value: 'details', label: '詳細', content: <p className="text-gray-700 dark:text-gray-300">詳細タブの内容です。</p> },
      { value: 'settings', label: '設定', content: <p className="text-gray-700 dark:text-gray-300">設定タブの内容です。</p> },
    ],
  },
};

export const WithColor: Story = {
  args: {
    color: '#8B5CF6',
    tabs: [
      { value: 'tab1', label: 'タブ1', content: <p className="text-gray-700 dark:text-gray-300">カスタムカラー付きタブ。</p> },
      { value: 'tab2', label: 'タブ2', content: <p className="text-gray-700 dark:text-gray-300">2つ目のタブ。</p> },
    ],
  },
};

export const TwoTabs: Story = {
  args: {
    tabs: [
      { value: 'a', label: '強み', content: <ul className="list-disc pl-4 text-gray-600 dark:text-gray-400"><li>強み1</li><li>強み2</li></ul> },
      { value: 'b', label: '成長', content: <ul className="list-disc pl-4 text-gray-600 dark:text-gray-400"><li>成長1</li><li>成長2</li></ul> },
    ],
  },
};
