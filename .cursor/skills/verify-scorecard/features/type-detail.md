# Type detail

Type detail pages explain one of the six Claude Code types at `/types/[typeId]` with overview tabs and a path back into diagnosis.

## Sub-features

- `type-overview` shows **対象**, **特徴**, and **キーワード** under tab **概要**.
- `type-strengths` shows strengths/growth under tab **強み・成長**.
- `type-setup` shows **推奨する最初の一手** and ideal profile under tab **推奨設定**.
- `type-related` lists sibling types under tab **関連タイプ** and navigates to `/types/<id>`.
- `type-unknown` invalid `typeId` redirects to `/`.
- `type-start-diagnose` starts the quiz from the header CTA **診断を始める**.

## How to get to it (user POV)

- From home, click a card under **6つのタイプ**.
- From result **関連タイプ**, choose another type.
- Open `/types/basic`, `/types/specDriven`, `/types/harness`, `/types/multiAgent`, `/types/academic`, or `/types/outcome` directly.

## Driving it with Playwright

Preconditions:

- App is healthy at the launched base URL.
- Doctor passed.

- **Open Explorer.** `page.goto('$BASE_URL/types/basic')`. Expect visible `Explorer` and Japanese `探索者`.
- **Switch tab.** Click `getByRole('tab', { name: '強み・成長' })`. Expect **強み** / **成長の方向性**.
- **Setup tab.** Click `getByRole('tab', { name: '推奨設定' })`. Expect **推奨する最初の一手**.
- **Related tab.** Click `getByRole('tab', { name: '関連タイプ' })`, then a sibling button (e.g. containing `Architect`). URL becomes `/types/specDriven`.
- **Invalid id.** `page.goto('$BASE_URL/types/not-a-type')` redirects to `/`.
- **From home card.** On `/`, click `page.locator('button').filter({ hasText: 'Explorer' }).filter({ hasText: '探索者' })` under **6つのタイプ** (not the hero icon cluster). URL `/types/basic`.
- **Start diagnose.** Click header `getByRole('button', { name: '診断を始める' })`. URL `/diagnose`.
- **Proof.** Screenshot `artifacts/type-detail/basic.png` showing type name and **概要** content.

## Gotchas

- Type ids are camelCase English (`specDriven`), not the display names.
- Home hero also renders type names in a non-clickable icon cluster (`hidden` below `lg`); only the **6つのタイプ** cards navigate.
- Client component `use(params)` — wait for content, not only HTTP 200.
