/**
 * @typedef {'housing'|'food'|'transport'|'health'|'learning'|'social'|'other'} CategoryValue
 *
 * @typedef {Object} Expense
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {CategoryValue} category
 * @property {number} amount            Positive number, up to 2 decimal places.
 * @property {string} date              ISO date (YYYY-MM-DD), when the expense occurred.
 * @property {string} createdAt         ISO timestamp of the record's creation.
 *
 * @typedef {Object} ExpenseDraft
 * @property {string} title
 * @property {string} description
 * @property {CategoryValue} category
 * @property {number} amount
 * @property {string} date
 *
 * @typedef {
 *   | { type: 'hydrate', payload: Expense[] }
 *   | { type: 'add', payload: Expense }
 *   | { type: 'update', payload: { id: string, patch: Partial<Expense> } }
 *   | { type: 'delete', payload: string }
 * } ExpenseAction
 */

export {}
