# Type detail

Type detail pages explain one of the six Claude Code types at `/types/[typeId]` with overview tabs and a path back into diagnosis.

## Sub-features

- `type-overview` shows **対象**, **特徴**, and **キーワード** under tab **概要**.
- `type-strengths` shows strengths/growth under tab **強み・成長**.
- `type-unknown` invalid `typeId` redirects to `/`.
- `type-start-diagnose` starts the quiz from the detail page CTA (button text includes diagnosis start wording when present).
- `type-related` navigates to sibling type pages.

## How to get to it (user POV)

- From home, click a card under **6つのタイプ**.
- From result **関連タイプ**, choose another type.
- Open `/types/basic`, `/types/specDriven`, `/types/harness`, `/types/multiAgent`, `/types/academic`, or `/types/outcome` directly.

## Driving it with Playwright

Preconditions:

- App is healthy at the launched base URL.
- Doctor passed.

- **Open Explorer.** `page.goto('$BASE_URL/types/basic')`. Expect visible `Explorer` and Japanese `探索者`.
- **Switch tab.** Click `getByRole('tab', { name: '強み・成長' })`. Expect strength/growth content.
- **Invalid id.** `page.goto('$BASE_URL/types/not-a-type')` redirects to `/`.
- **From home card.** On `/`, click card text `Explorer` (or containing `探索者`). URL `/types/basic`.
- **Proof.** Screenshot `artifacts/type-detail/basic.png` showing type name and **概要** content.

## Gotchas

- Type ids are camelCase English (`specDriven`), not the display names.
- Some layout uses horizontal scroll for related types; ensure the target is scrolled into view before click.
- Client component `use(params)` — wait for content, not only HTTP 200.
