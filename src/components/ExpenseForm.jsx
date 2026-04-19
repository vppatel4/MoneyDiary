import { useEffect, useId, useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { EXPENSE_CATEGORIES } from '../constants/categories'
import { validateExpense } from '../utils/validation'

const PLACEHOLDERS = [
  'e.g., Weekly groceries',
  'e.g., Netflix subscription',
  'e.g., Uber ride home',
  'e.g., Gym membership',
  'e.g., Coffee with friends',
]

function useCyclingPlaceholder() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % PLACEHOLDERS.length), 3000)
    return () => clearInterval(id)
  }, [])
  return PLACEHOLDERS[idx]
}

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const empty = {
  title: '',
  description: '',
  category: EXPENSE_CATEGORIES[0].value,
  amountRaw: '',
  date: todayISO(),
}

function initialValues(editing) {
  if (!editing) return { ...empty, date: todayISO() }
  return {
    title: editing.title,
    description: editing.description ?? '',
    category: editing.category,
    amountRaw: String(editing.amount),
    date: editing.date ?? todayISO(),
  }
}

export function ExpenseForm({ editing, onSubmit, onCancelEdit }) {
  const formId = useId()
  const placeholder = useCyclingPlaceholder()
  const [values, setValues] = useState(() => initialValues(editing))
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  function handleChange(field, v) {
    setValues((s) => ({ ...s, [field]: v }))
    if (touched[field]) {
      const { errors: e } = validateExpense({ ...values, [field]: v })
      setErrors((prev) => ({ ...prev, [field]: e[field] }))
    }
  }

  function handleBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }))
    const { errors: e } = validateExpense({ ...values })
    setErrors((prev) => ({ ...prev, [field]: e[field] }))
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const { errors: nextErrors, values: v } = validateExpense(values)
    setErrors(nextErrors)
    setTouched({
      title: true,
      description: true,
      category: true,
      amount: true,
    })
    if (Object.keys(nextErrors).length) return

    onSubmit({
      id: editing?.id,
      title: v.title,
      description: v.description,
      category: v.category,
      amount: v.amount,
      date: values.date,
    })
    if (!editing) setValues({ ...empty, date: todayISO() })
  }

  const isEdit = Boolean(editing)

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-card__head">
        <div>
          <p className="eyebrow">{isEdit ? 'Edit entry' : 'New entry'}</p>
          <h2 className="form-card__title">{isEdit ? 'Update expense' : 'Log an expense'}</h2>
        </div>
        {isEdit ? (
          <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="field-grid">
        <div className="field field--full">
          <label className="label" htmlFor={`${formId}-title`}>
            Title <span className="req">*</span>
          </label>
          <input
            id={`${formId}-title`}
            className={`input ${errors.title ? 'input--invalid' : ''}`}
            value={values.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            placeholder={placeholder}
            autoComplete="off"
            maxLength={120}
          />
          {errors.title ? <p className="field-error">{errors.title}</p> : null}
        </div>

        <div className="field field--full">
          <label className="label" htmlFor={`${formId}-desc`}>
            Description
          </label>
          <textarea
            id={`${formId}-desc`}
            className={`textarea ${errors.description ? 'input--invalid' : ''}`}
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            rows={3}
            placeholder="Optional notes: vendor, subscription period, split with roommate"
          />
          {errors.description ? <p className="field-error">{errors.description}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor={`${formId}-cat`}>
            Category <span className="req">*</span>
          </label>
          <select
            id={`${formId}-cat`}
            className={`select ${errors.category ? 'input--invalid' : ''}`}
            value={values.category}
            onChange={(e) => handleChange('category', e.target.value)}
            onBlur={() => handleBlur('category')}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category ? <p className="field-error">{errors.category}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor={`${formId}-date`}>
            Date <span className="req">*</span>
          </label>
          <input
            id={`${formId}-date`}
            type="date"
            className={`input ${errors.date ? 'input--invalid' : ''}`}
            value={values.date}
            onChange={(e) => handleChange('date', e.target.value)}
            onBlur={() => handleBlur('date')}
            max={todayISO()}
          />
          {errors.date ? <p className="field-error">{errors.date}</p> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor={`${formId}-amt`}>
            Amount <span className="req">*</span>
          </label>
          <div className="amount-wrap">
            <span className="amount-prefix" aria-hidden="true">
              $
            </span>
            <input
              id={`${formId}-amt`}
              inputMode="decimal"
              pattern="[0-9]*\.?[0-9]*"
              className={`input input--amount ${errors.amount ? 'input--invalid' : ''}`}
              value={values.amountRaw}
              onChange={(e) => handleChange('amountRaw', e.target.value)}
              onBlur={() => handleBlur('amount')}
              placeholder="0"
              autoComplete="off"
            />
          </div>
          {errors.amount ? <p className="field-error">{errors.amount}</p> : null}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary">
          {isEdit ? <Save size={18} aria-hidden /> : <Plus size={18} aria-hidden />}
          {isEdit ? 'Save changes' : 'Add expense'}
        </button>
      </div>
    </form>
  )
}
