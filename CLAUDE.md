@AGENTS.md

## デザインシステム

shadcn/ui を採用。コンポーネントは components/ui/ に配置。

### UI作業のルール
- 新しいUIを作るときは shadcn/ui の既存コンポーネントを確認
- 存在しない場合: npx shadcn@latest add [コンポーネント名]
- カスタマイズは components/ui/ 内のファイルを直接編集
- UI品質チェック: /audit → /polish → /delight（Impeccable）
- 品質基準の詳細: ~/.claude/docs/rules/design-quality.md を参照

### Storybook
- npm run storybook で起動（http://localhost:6006）
- 新しいコンポーネント追加時は必ずストーリーも作成
- ストーリー配置先: src/stories/ui/
