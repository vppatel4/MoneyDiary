import { useState } from 'react'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function RangePicker({ onPick }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  return (
    <div className="mypicker__range">
      <label className="mypicker__range-label">
        <span>From</span>
        <input
          type="date"
          className="mypicker__range-input"
          value={from}
          max={to || todayStr()}
          onChange={(e) => setFrom(e.target.value)}
        />
      </label>
      <label className="mypicker__range-label">
        <span>To</span>
        <input
          type="date"
          className="mypicker__range-input"
          value={to}
          min={from}
          max={todayStr()}
          onChange={(e) => setTo(e.target.value)}
        />
      </label>
      <button
        type="button"
        className="mypicker__apply"
        disabled={!from || !to}
        onClick={() => from && to && onPick(from, to)}
      >
        Apply
      </button>
    </div>
  )
}
