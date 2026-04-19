import { useMemo, useState } from 'react'
import { BookMarked } from 'lucide-react'
import './App.css'
import { EXPENSE_CATEGORIES } from './constants/categories'
import { CategoryFilter } from './components/CategoryFilter'
import { ConfirmDialog } from './components/ConfirmDialog'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { SpendingBreakdown } from './components/SpendingBreakdown'
import { SummaryBar } from './components/SummaryBar'
import { useLocalExpenses } from './hooks/useLocalExpenses'

export default function App() {
  const { expenses, hydrated, addExpense, updateExpense, deleteExpense } = useLocalExpenses()
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const filtered = useMemo(() => {
    if (filter === 'all') return expenses
    return expenses.filter((e) => e.category === filter)
  }, [expenses, filter])

  const counts = useMemo(() => {
    const base = { all: expenses.length }
    for (const c of EXPENSE_CATEGORIES) base[c.value] = 0
    for (const e of expenses) {
      if (base[e.category] != null) base[e.category] += 1
    }
    return base
  }, [expenses])

  function handleFormSubmit(payload) {
    const { id, title, description, category, amount, date } = payload
    if (id) {
      updateExpense(id, { title, description, category, amount, date })
      setEditing(null)
    } else {
      addExpense({ title, description, category, amount, date })
    }
  }

  if (!hydrated) {
    return (
      <div className="app-shell">
        <div className="loading" role="status" aria-live="polite">
          <div className="loader-ring" />
          Opening your diary...
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__brand">
          <span className="hero__mark" aria-hidden>
            <BookMarked size={26} strokeWidth={1.75} />
          </span>
          <div>
            <p className="eyebrow">Expense tracker</p>
            <h1 className="hero__title">MoneyDiary</h1>
            <p className="hero__lede">A quiet place to log where your money actually goes.</p>
          </div>
        </div>
      </header>

      <SummaryBar expenses={expenses} />

      <main className="layout">
        <section className="layout__col layout__col--form" aria-labelledby="form-heading">
          <h2 id="form-heading" className="sr-only">
            Expense form
          </h2>
          <ExpenseForm
            key={editing?.id ?? 'new'}
            editing={editing}
            onSubmit={handleFormSubmit}
            onCancelEdit={() => setEditing(null)}
          />
        </section>
        <section className="layout__col" aria-labelledby="list-heading">
          <div className="list-head">
            <div>
              <p className="eyebrow">Ledger</p>
              <h2 id="list-heading" className="list-head__title">
                Recent expenses
              </h2>
            </div>
          </div>
          <CategoryFilter value={filter} onChange={setFilter} counts={counts} />
          <ExpenseList
            items={filtered}
            onEdit={(e) => setEditing(e)}
            onDelete={(e) => setPendingDelete(e)}
          />
        </section>

        <SpendingBreakdown expenses={expenses} />
      </main>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove this entry?"
        message={
          pendingDelete
            ? `“${pendingDelete.title}” will be permanently removed from this browser’s diary.`
            : ''
        }
        confirmLabel="Delete"
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            const id = pendingDelete.id
            deleteExpense(id)
            if (editing?.id === id) setEditing(null)
          }
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
