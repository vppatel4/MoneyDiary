import { useMemo, useState } from 'react'
import { CalendarDays, TrendingUp } from 'lucide-react'
import { categoryLabel } from '../constants/categories'

function formatMoney(n) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function getDateKey(expense, mode) {
  const raw = expense.date || expense.createdAt || ''
  if (!raw) return 'Unknown'
  const d = new Date(raw)
  if (mode === 'month') {
    return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(d)
  }
  return String(d.getFullYear())
}

function getSortKey(expense, mode) {
  const raw = expense.date || expense.createdAt || ''
  if (!raw) return ''
  if (mode === 'month') return raw.slice(0, 7)
  return raw.slice(0, 4)
}

export function SpendingBreakdown({ expenses }) {
  const [mode, setMode] = useState('month')
  const [expandedPeriod, setExpandedPeriod] = useState(null)

  const grouped = useMemo(() => {
    const map = {}
    for (const e of expenses) {
      const key = getDateKey(e, mode)
      const sortKey = getSortKey(e, mode)
      if (!map[key]) map[key] = { total: 0, count: 0, sortKey, byCat: {} }
      map[key].total += e.amount
      map[key].count += 1
      map[key].byCat[e.category] = (map[key].byCat[e.category] ?? 0) + e.amount
    }
    return Object.entries(map).sort((a, b) => b[1].sortKey.localeCompare(a[1].sortKey))
  }, [expenses, mode])

  const maxTotal = grouped.length ? Math.max(...grouped.map(([, g]) => g.total)) : 1

  if (!expenses.length) return null

  return (
    <section className="breakdown" aria-labelledby="breakdown-heading">
      <div className="breakdown__head">
        <div>
          <p className="eyebrow">Insights</p>
          <h2 id="breakdown-heading" className="breakdown__title">Spending over time</h2>
        </div>
        <div className="breakdown__toggle">
          <button
            type="button"
            className={`breakdown__btn ${mode === 'month' ? 'breakdown__btn--active' : ''}`}
            onClick={() => { setMode('month'); setExpandedPeriod(null) }}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`breakdown__btn ${mode === 'year' ? 'breakdown__btn--active' : ''}`}
            onClick={() => { setMode('year'); setExpandedPeriod(null) }}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="breakdown__list">
        {grouped.map(([label, data]) => (
          <div key={label} className="breakdown__row">
            <button
              type="button"
              className="breakdown__row-btn"
              onClick={() => setExpandedPeriod(expandedPeriod === label ? null : label)}
              aria-expanded={expandedPeriod === label}
            >
              <div className="breakdown__row-info">
                <CalendarDays size={16} className="breakdown__row-icon" />
                <span className="breakdown__period">{label}</span>
                <span className="breakdown__count">{data.count} {data.count === 1 ? 'entry' : 'entries'}</span>
              </div>
              <span className="breakdown__amount">{formatMoney(data.total)}</span>
            </button>
            <div className="breakdown__bar-track">
              <div
                className="breakdown__bar-fill"
                style={{ width: `${(data.total / maxTotal) * 100}%` }}
              />
            </div>
            {expandedPeriod === label && (
              <div className="breakdown__detail">
                {Object.entries(data.byCat)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, amt]) => (
                    <div key={cat} className="breakdown__cat-row">
                      <span className="breakdown__cat-name">{categoryLabel(cat)}</span>
                      <span className="breakdown__cat-amt">{formatMoney(amt)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
