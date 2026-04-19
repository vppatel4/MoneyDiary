import { EXPENSE_CATEGORIES } from '../constants/categories'

const TITLE_MAX = 120
const DESC_MAX = 500

export function validateExpense({ title, description, category, amountRaw }) {
  const errors = {}

  const t = (title ?? '').trim()
  if (!t) errors.title = 'Title is required.'
  else if (t.length > TITLE_MAX)
    errors.title = `Title must be at most ${TITLE_MAX} characters.`

  const d = (description ?? '').trim()
  if (d.length > DESC_MAX)
    errors.description = `Description must be at most ${DESC_MAX} characters.`

  const allowed = new Set(EXPENSE_CATEGORIES.map((c) => c.value))
  if (!category || !allowed.has(category)) {
    errors.category = 'Please choose a valid category.'
  }

  const a = String(amountRaw ?? '').trim()
  if (!a) errors.amount = 'Amount is required.'
  else if (!/^\d+(\.\d{1,2})?$/.test(a)) errors.amount = 'Enter a valid amount (up to 2 decimal places).'
  else {
    const n = Number(a)
    if (n <= 0) errors.amount = 'Amount must be greater than zero.'
    if (n > 1_000_000_000) errors.amount = 'Amount is too large.'
  }

  return { errors, values: { title: t, description: d, category, amount: a ? Number(a) : 0 } }
}
