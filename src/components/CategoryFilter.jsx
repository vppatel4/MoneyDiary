import { EXPENSE_CATEGORIES } from '../constants/categories'

export function CategoryFilter({ value, onChange, counts }) {
  return (
    <div className="filter" role="group" aria-label="Filter by category">
      <p className="filter__label">Filter</p>
      <div className="filter__chips">
        <button
          type="button"
          className={`chip ${value === 'all' ? 'chip--active' : ''}`}
          onClick={() => onChange('all')}
        >
          All
          <span className="chip__meta">{counts.all}</span>
        </button>
        {EXPENSE_CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            className={`chip ${value === c.value ? 'chip--active' : ''}`}
            onClick={() => onChange(c.value)}
          >
            {c.label}
            <span className="chip__meta">{counts[c.value] ?? 0}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
