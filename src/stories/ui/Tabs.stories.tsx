import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">概要</TabsTrigger>
        <TabsTrigger value="tab2">詳細</TabsTrigger>
        <TabsTrigger value="tab3">設定</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">概要タブの内容です。</TabsContent>
      <TabsContent value="tab2">詳細タブの内容です。</TabsContent>
      <TabsContent value="tab3">設定タブの内容です。</TabsContent>
    </Tabs>
  ),
};

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList variant="line">
        <TabsTrigger value="tab1">概要</TabsTrigger>
        <TabsTrigger value="tab2">詳細</TabsTrigger>
        <TabsTrigger value="tab3">設定</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">ライン表示の概要です。</TabsContent>
      <TabsContent value="tab2">ライン表示の詳細です。</TabsContent>
      <TabsContent value="tab3">ライン表示の設定です。</TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="tab1" orientation="vertical" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">タブ1</TabsTrigger>
        <TabsTrigger value="tab2">タブ2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">縦タブ1の内容</TabsContent>
      <TabsContent value="tab2">縦タブ2の内容</TabsContent>
    </Tabs>
  ),
};
