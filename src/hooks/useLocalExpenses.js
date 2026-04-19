import { useCallback, useEffect, useReducer } from 'react'
import '../types.js' // JSDoc types

const STORAGE_KEY = 'moneydiary:expenses:v1'

function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* ignore quota / private mode */
  }
}

const initialState = {
  expenses: [],
  hydrated: false,
}

/**
 * @param {{ expenses: Expense[], hydrated: boolean }} state
 * @param {ExpenseAction} action
 */
function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return { ...state, expenses: action.payload, hydrated: true }
    case 'add': {
      const next = [action.payload, ...state.expenses]
      return { ...state, expenses: next }
    }
    case 'update': {
      const next = state.expenses.map((e) =>
        e.id === action.payload.id ? { ...e, ...action.payload.patch } : e,
      )
      return { ...state, expenses: next }
    }
    case 'delete': {
      const next = state.expenses.filter((e) => e.id !== action.payload)
      return { ...state, expenses: next }
    }
    default:
      return state
  }
}

export function useLocalExpenses() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({ type: 'hydrate', payload: load() })
  }, [])

  useEffect(() => {
    if (!state.hydrated) return
    persist(state.expenses)
  }, [state.expenses, state.hydrated])

  const addExpense = useCallback((expense) => {
    dispatch({
      type: 'add',
      payload: {
        id: makeId(),
        createdAt: new Date().toISOString(),
        date: expense.date || new Date().toISOString().slice(0, 10),
        ...expense,
      },
    })
  }, [])

  const updateExpense = useCallback((id, patch) => {
    dispatch({ type: 'update', payload: { id, patch } })
  }, [])

  const deleteExpense = useCallback((id) => {
    dispatch({ type: 'delete', payload: id })
  }, [])

  return {
    expenses: state.expenses,
    hydrated: state.hydrated,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}
