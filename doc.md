# Dictionary for Worship Bot

Schedule cells use category keys (optionally combined with ` / `, e.g. `ВокалЧт2 / ІнстЧт`).
Members are read from the **Команди** block on the month sheet (default `H30:Z45`): header row = category names, rows below = people. Extra categories can extend to columns O, P, Q, …

| Key      | Team                   |
| -------- | ---------------------- |
| ВокалЧт1 | Thursday vocal 1       |
| ВокалЧт2 | Thursday vocal 2       |
| ІнстЧт   | Thursday instrumental  |
| ВокалПт  | Friday vocal           |
| ІнстПт   | Friday instrumental    |
| ВокалНд  | Sunday vocal           |
| ІнстНд   | Sunday instrumental    |
| Звук: …  | Sound tech (hardcoded) |
| Апаратура: … | Gear (hardcoded)   |

Spaces are ignored when matching (`Вокал Чт` ↔ `ВокалЧт` ↔ `ВокалЧт1`).
Mixed cells pull everyone from every listed category (deduped). Separate cells on the same day stay separate rehearsals.

Display names → Telegram handles live in `PERSON_HANDLES` (`src/constants.ts`).

## Env

| Var | Example |
| --- | --- |
| `SPREADSHEET_ID` | from sheet URL `/d/…/edit` |
| `SHEET_RANGE` | `A1:G40` (calendar only is fine) |
| `TEAMS_CONFIG_RANGE` | `H30:Z45` (optional; default covers Команди) |
| `SHEET_NAME` | `November` (tab name; falls back to current English month) |
| `YOUTH_MINISTRY_*` | optional — leave unset if unused |
