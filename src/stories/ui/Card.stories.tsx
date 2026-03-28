import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>カードタイトル</CardTitle>
        <CardDescription>カードの説明文です</CardDescription>
      </CardHeader>
      <CardContent>
        <p>カードのコンテンツです。</p>
      </CardContent>
      <CardFooter>
        <Button>アクション</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  render: () => (
    <Card className="w-[300px]" size="sm">
      <CardHeader>
        <CardTitle>小さいカード</CardTitle>
        <CardDescription>コンパクト表示</CardDescription>
      </CardHeader>
      <CardContent>
        <p>コンテンツ</p>
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>通知設定</CardTitle>
        <CardDescription>通知を管理します</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">編集</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>通知のカスタマイズができます。</p>
      </CardContent>
    </Card>
  ),
};
