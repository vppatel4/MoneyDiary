import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarSearch, Layers, Wallet } from 'lucide-react'
import { categoryLabel } from '../constants/categories'
import { useCountUp } from '../hooks/useCountUp'
import { PeriodPicker } from './PeriodPicker'

function formatMoney(n) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function computePeriodTotal(expenses, { mode, selYear, selMonth, rangeFrom, rangeTo }) {
  if (mode === 'year') {
    const key = String(selYear)
    const total = expenses
      .filter((e) => (e.date || e.createdAt || '').startsWith(key))
      .reduce((s, e) => s + e.amount, 0)
    return { total, label: key }
  }
  if (mode === 'range' && rangeFrom && rangeTo) {
    const total = expenses
      .filter((e) => {
        const d = (e.date || e.createdAt || '').slice(0, 10)
        return d >= rangeFrom && d <= rangeTo
      })
      .reduce((s, e) => s + e.amount, 0)
    return { total, label: `${rangeFrom} to ${rangeTo}` }
  }
  const key = `${selYear}-${String(selMonth + 1).padStart(2, '0')}`
  const total = expenses
    .filter((e) => (e.date || e.createdAt || '').startsWith(key))
    .reduce((s, e) => s + e.amount, 0)
  const label = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(selYear, selMonth))
  return { total, label }
}

export function SummaryBar({ expenses }) {
  const now = new Date()
  const calBtnRef = useRef(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [mode, setMode] = useState('month')
  const [selYear, setSelYear] = useState(now.getFullYear())
  const [selMonth, setSelMonth] = useState(now.getMonth())
  const [rangeFrom, setRangeFrom] = useState(null)
  const [rangeTo, setRangeTo] = useState(null)

  const total = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses])
  const animatedTotal = useCountUp(total)

  const { total: periodTotal, label: periodLabel } = computePeriodTotal(expenses, {
    mode,
    selYear,
    selMonth,
    rangeFrom,
    rangeTo,
  })

  const top = useMemo(() => {
    const byCat = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount
      return acc
    }, {})
    return Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]
  }, [expenses])

  function handlePick(yearOrFrom, monthOrTo) {
    if (mode === 'range') {
      setRangeFrom(yearOrFrom)
      setRangeTo(monthOrTo)
    } else if (mode === 'year') {
      setSelYear(yearOrFrom)
    } else {
      setSelYear(yearOrFrom)
      setSelMonth(monthOrTo)
    }
    setPickerOpen(false)
  }

  return (
    <div className="summary">
      <article className="summary__tile summary__tile--accent">
        <div className="summary__icon summary__icon--accent" aria-hidden>
          <Wallet size={20} />
        </div>
        <p className="summary__label">Total Expense</p>
        <p className="summary__value">{formatMoney(animatedTotal)}</p>
      </article>

      <article className="summary__tile summary__tile--browse">
        <div className="summary__icon" aria-hidden>
          <CalendarSearch size={20} />
        </div>
        <p className="summary__label">{periodLabel}</p>
        <p className="summary__value">{formatMoney(periodTotal)}</p>
        <button
          type="button"
          ref={calBtnRef}
          className="summary__cal-btn"
          onClick={() => setPickerOpen((o) => !o)}
          aria-label="Pick month, year, or range"
          aria-expanded={pickerOpen}
        >
          <CalendarSearch size={16} />
        </button>
      </article>

      {pickerOpen &&
        createPortal(
          <PeriodPicker
            selectedYear={selYear}
            selectedMonth={selMonth}
            mode={mode}
            onModeChange={setMode}
            onPick={handlePick}
            onClose={() => setPickerOpen(false)}
            anchorRef={calBtnRef}
          />,
          document.body,
        )}

      <article className="summary__tile">
        <div className="summary__icon" aria-hidden>
          <Layers size={20} />
        </div>
        <p className="summary__label">Top Category</p>
        <p className="summary__value summary__value--sm">
          {top ? `${categoryLabel(top[0])} · ${formatMoney(top[1])}` : '—'}
        </p>
      </article>
    </div>
  )
}
