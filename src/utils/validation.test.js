import { describe, expect, it } from 'vitest'
import { validateExpense } from './validation'

const base = {
  title: 'Groceries',
  description: '',
  category: 'food',
  amountRaw: '12.34',
}

describe('validateExpense', () => {
  it('accepts a well-formed expense', () => {
    const { errors, values } = validateExpense(base)
    expect(errors).toEqual({})
    expect(values.amount).toBe(12.34)
  })

  it('requires a non-empty, trimmed title', () => {
    const { errors } = validateExpense({ ...base, title: '   ' })
    expect(errors.title).toMatch(/required/i)
  })

  it('rejects unknown categories', () => {
    const { errors } = validateExpense({ ...base, category: 'hamburgers' })
    expect(errors.category).toMatch(/valid category/i)
  })

  it('rejects zero, negative, and more than 2 decimal places', () => {
    expect(validateExpense({ ...base, amountRaw: '0' }).errors.amount).toMatch(/greater than zero/i)
    expect(validateExpense({ ...base, amountRaw: '-5' }).errors.amount).toMatch(/valid amount/i)
    expect(validateExpense({ ...base, amountRaw: '1.234' }).errors.amount).toMatch(/valid amount/i)
  })

  it('rejects amounts above the hard cap', () => {
    const { errors } = validateExpense({ ...base, amountRaw: '9999999999' })
    expect(errors.amount).toMatch(/too large/i)
  })
})
