import { Pencil, Trash2 } from 'lucide-react'
import { categoryLabel } from '../constants/categories'

function formatMoney(n) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function parseLocalDate(iso) {
  if (!iso) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d
}

function formatDate(iso) {
  const d = parseLocalDate(iso)
  if (!d) return ''
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function ExpenseList({ items, onEdit, onDelete }) {
  if (!items.length) {
    return (
      <div className="empty">
        <p className="empty__title">Your diary is open</p>
        <p className="empty__text">
          Add your first expense on the left. Everything stays in this browser until you clear site
          data.
        </p>
      </div>
    )
  }

  return (
    <div className="list-wrap">
      <ul className="expense-list" aria-label="Expense entries">
        {items.map((e) => (
          <li key={e.id} className="expense-row">
            <div className="expense-row__main">
              <div className="expense-row__top">
                <span className="pill">{categoryLabel(e.category)}</span>
                <time className="expense-row__date" dateTime={e.date || e.createdAt}>
                  {formatDate(e.date || e.createdAt)}
                </time>
              </div>
              <p className="expense-row__title">{e.title}</p>
              {e.description ? <p className="expense-row__desc">{e.description}</p> : null}
            </div>
            <div className="expense-row__side">
              <p className="expense-row__amount">{formatMoney(e.amount)}</p>
              <div className="expense-row__actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => onEdit(e)}
                  aria-label={`Edit ${e.title}`}
                >
                  <Pencil size={18} />
                </button>
                <button
                  type="button"
                  className="icon-btn icon-btn--danger"
                  onClick={() => onDelete(e)}
                  aria-label={`Delete ${e.title}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
