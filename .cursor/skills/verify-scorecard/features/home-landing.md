# Home landing

The home page introduces Claude Code Type, shows six type cards, and lets the user start a diagnosis or open a type detail page.

## Sub-features

- `home-hero` shows the Japanese hero copy and the primary CTA **無料で診断する**.
- `home-header-cta` starts diagnosis from the sticky header button **診断を始める**.
- `home-type-cards` lists the six types under heading **6つのタイプ** and opens `/types/<id>` on card click.
- `home-banner-cta` starts diagnosis from the bottom coral banner **診断を始める**.
- `home-branding` shows header title **Claude Code Type** and footer disclaimer that the tool is unofficial.

## How to get to it (user POV)

- Open `http://127.0.0.1:4310/` (or the launched base URL).
- Click the header logo/title from another page that routes home (`/`).

## Driving it with Playwright

Preconditions:

- App is healthy at the launched base URL.
- Doctor reports home CTA text present.
- Fresh browser context.

- **Open home.** Navigate to `/`. Expect a heading containing `Claude Code Type` and visible text `あなたの` / `Claude Code` / `タイプは？`.
- **Hero CTA.** Click `getByRole('button', { name: '無料で診断する' })`. URL becomes `/diagnose` and `Q1.` is visible.
- **Header CTA.** From `/`, click `getByRole('button', { name: '診断を始める' }).first()` (header). URL becomes `/diagnose`.
- **Type card.** Click a card whose text includes `Explorer` (or navigate via card click for id `basic`). URL becomes `/types/basic`.
- **Proof.** Screenshot `artifacts/home-landing/home.png` showing header branding and the hero CTA. Optionally capture after CTA click as `artifacts/home-landing/diagnose-entry.png` with `Q1.` visible.

## Gotchas

- There are multiple **診断を始める** buttons (header + banner). Scope with `.first()` or locate within `header` / the coral banner section.
- Type icon cluster on the right is `hidden` below the `lg` breakpoint; do not require it in mobile viewports.
- Dark mode may change colors but not CTA labels.
