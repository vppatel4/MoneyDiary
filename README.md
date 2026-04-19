# MoneyDiary

A small single-page expense tracker I built for the Full-Stack Software Developer pre-interview exercise (ASU Office of University Affairs, Collaboratory Intern).

Built with React and Vite. No backend. Expenses are saved to `localStorage` under a versioned key so the data shape can evolve later without breaking existing data.

**Repo:** https://github.com/vppatel4/MoneyDiary

## What it does

- Add, edit, and delete expenses with title, description, category, amount, and date.
- Filter by category with live per-category counts.
- Summary bar with total, current-period total (month / year / custom range), and the top category.
- Spending breakdown panel that drills down by category across months or years.
- Delete confirmation dialog with Escape-to-close, Tab focus trap, and focus returned to the trigger button.
- Inline validation (required title, trimmed inputs, decimal-aware amounts with a hard cap).
- Works from 375 px mobile widths up through desktop.

## Run it locally

```bash
git clone https://github.com/vppatel4/MoneyDiary.git
cd MoneyDiary
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest unit tests for the validation utility
npm run build    # production build
```

## Project layout

```
MoneyDiary/
├─ src/
│  ├─ App.jsx, App.css, index.css, main.jsx
│  ├─ components/
│  │   ├─ ExpenseForm.jsx        (controlled inputs + validation)
│  │   ├─ ExpenseList.jsx        (read / edit / delete rows)
│  │   ├─ CategoryFilter.jsx     (chip group with live counts)
│  │   ├─ SummaryBar.jsx         (total, period total, top category)
│  │   ├─ PeriodPicker.jsx       (month / year selector)
│  │   ├─ RangePicker.jsx        (custom date range)
│  │   ├─ SpendingBreakdown.jsx  (drill-down by category + time)
│  │   └─ ConfirmDialog.jsx      (accessible modal)
│  ├─ hooks/
│  │   ├─ useLocalExpenses.js    (useReducer + localStorage)
│  │   └─ useCountUp.js          (animated Total tile)
│  ├─ utils/
│  │   ├─ validation.js
│  │   └─ validation.test.js     (Vitest)
│  ├─ constants/                 (categories, limits)
│  └─ types.js                   (JSDoc typedefs)
├─ docs/
│  └─ DECISIONS.md               (ADRs for the three choices worth questioning)
├─ public/                       (favicon, icons)
├─ index.html
├─ vite.config.js
├─ eslint.config.js
└─ package.json
```

## How state works

All state lives in `useLocalExpenses`, a custom hook built on `useReducer`. The reducer is the only thing that mutates the expense list. There are four actions: `hydrate`, `add`, `update`, `delete`. A small `useEffect` saves to `localStorage` on every committed change, and a `hydrated` flag keeps the first render from overwriting saved data with an empty list.

Types for `Expense`, `ExpenseDraft`, and `ExpenseAction` are written as JSDoc in `src/types.js`, so moving to TypeScript later is mostly a rename pass.

## Choices I made and why

- **Amount precision.** The brief says amount "should be an integer." I allowed up to two decimal places because real spending has cents. I read "integer" as shorthand for "a valid positive number, not a string, not NaN." Flipping it back to integer-only is a one-line change in `src/utils/validation.js`. Noted in `docs/DECISIONS.md`.
- **localStorage, not IndexedDB.** The data is small, well under the 5 MB browser budget. A JSON array also matches what a real REST API would return, so moving to a backend later is mostly a fetch swap. The versioned key (`moneydiary:expenses:v1`) gives a clean path if the shape changes.
- **`useReducer` over `useState`.** CRUD has four distinct transitions, and the reducer shape reads cleaner than four separate setState functions scattered across the app.
- **No router.** The exercise is single-page. Adding a router would be noise.
- **Plain CSS with custom properties.** All design tokens are at the top of `index.css`. No Tailwind or CSS-in-JS. Trade-off: no utility-class speed, but the whole stylesheet is greppable.
- **JSDoc instead of TypeScript.** Keeps the scaffold small while still giving editor intelligence for the reducer and validation shapes.

## What I'd add with more time

- TypeScript migration (types are already designed as JSDoc, so it is mostly a rename pass).
- CSV export and import so the diary is not trapped in one browser.
- Undo-on-delete toast with a short window before the reducer actually removes the row.
- Search by title and a free-text filter for the description field.
- End-to-end tests with Playwright; expand the Vitest suite to cover the reducer too.
- A real backend as sketched in the accompanying document (PostgreSQL + SSO-aware BFF + session cookies).

## Tests

```bash
npm test
```

The Vitest suite in `src/utils/validation.test.js` covers five cases: happy path, required title, unknown category, decimal / zero / negative amounts, and the hard cap.

## AI usage

I designed and wrote this project myself. I used AI tools (ChatGPT) only for small, non-core tasks: suggesting a starting CSS color palette so I would not default to the usual blue / purple SaaS look, light proofreading on a few paragraphs in the accompanying document, and a quick sanity check on a regex I had already written. The specific prompts are listed in the accompanying submission document in green, per the assignment rule.
