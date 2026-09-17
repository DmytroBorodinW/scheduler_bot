# Dictionary for Worship Bot

Sheet cells use these keys (optionally combined with ` / `, e.g. `ВокалЧт1 / ІнстЧт`):

| Key     | Team                          |
| ------- | ----------------------------- |
| ВокалЧт1 | Thursday vocal 1             |
| ВокалЧт2 | Thursday vocal 2             |
| ІнстЧт   | Thursday instrumental        |
| ВокалПт  | Friday vocal                 |
| ІнстПт   | Friday instrumental          |
| ВокалНд  | Sunday vocal                 |
| ІнстНд   | Sunday instrumental          |
| Звук: …  | Sound tech                   |
| Апаратура: … | Gear                     |

## Env

| Var | Example |
| --- | --- |
| `SPREADSHEET_ID` | from sheet URL `/d/…/edit` |
| `SHEET_RANGE` | `A1:G40` |
| `SHEET_NAME` | `October` (tab name; falls back to current English month) |
| `YOUTH_MINISTRY_*` | optional — leave unset if unused |
