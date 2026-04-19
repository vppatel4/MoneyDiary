export const EXPENSE_CATEGORIES = [
  { value: 'housing', label: 'Housing & utilities' },
  { value: 'food', label: 'Food & groceries' },
  { value: 'transport', label: 'Transport' },
  { value: 'health', label: 'Health & wellness' },
  { value: 'learning', label: 'Learning & books' },
  { value: 'social', label: 'Social & leisure' },
  { value: 'other', label: 'Other' },
]

export function categoryLabel(value) {
  return EXPENSE_CATEGORIES.find((c) => c.value === value)?.label ?? value
}
