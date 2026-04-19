import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { RangePicker } from './RangePicker'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function PeriodPicker({
  selectedYear,
  selectedMonth,
  mode,
  onPick,
  onModeChange,
  onClose,
  anchorRef,
}) {
  const now = new Date()
  const [browseYear, setBrowseYear] = useState(selectedYear)
  const ref = useRef(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!anchorRef?.current) return
    const rect = anchorRef.current.getBoundingClientRect()
    const pickerW = 280
    let left = rect.right - pickerW
    if (left < 8) left = 8
    if (left + pickerW > window.innerWidth - 8) left = window.innerWidth - pickerW - 8
    setPos({ top: rect.bottom + 8, left })
  }, [anchorRef])

  useEffect(() => {
    function onClickOut(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', onClickOut)
    return () => document.removeEventListener('mousedown', onClickOut)
  }, [onClose, anchorRef])

  const isCurrentYear = browseYear === now.getFullYear()

  return (
    <div className="mypicker" ref={ref} style={{ top: pos.top, left: pos.left }}>
      <div className="mypicker__header">
        <button
          type="button"
          className="mypicker__arrow"
          onClick={() => setBrowseYear((y) => y - 1)}
          aria-label="Previous year"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="mypicker__year">{browseYear}</span>
        <button
          type="button"
          className="mypicker__arrow"
          onClick={() => setBrowseYear((y) => y + 1)}
          disabled={isCurrentYear}
          aria-label="Next year"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mypicker__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'month'}
          className={`mypicker__tab ${mode === 'month' ? 'mypicker__tab--active' : ''}`}
          onClick={() => onModeChange('month')}
        >
          Monthly
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'year'}
          className={`mypicker__tab ${mode === 'year' ? 'mypicker__tab--active' : ''}`}
          onClick={() => {
            onModeChange('year')
            onPick(browseYear, null)
          }}
        >
          Yearly
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'range'}
          className={`mypicker__tab ${mode === 'range' ? 'mypicker__tab--active' : ''}`}
          onClick={() => onModeChange('range')}
        >
          Range
        </button>
      </div>

      {mode !== 'range' && (
        <div className="mypicker__grid">
          {MONTHS.map((m, i) => {
            const isFuture = browseYear === now.getFullYear() && i > now.getMonth()
            const isActive =
              mode === 'month' && selectedYear === browseYear && selectedMonth === i
            return (
              <button
                key={m}
                type="button"
                disabled={isFuture || mode === 'year'}
                className={`mypicker__cell ${isActive ? 'mypicker__cell--active' : ''} ${
                  mode === 'year' ? 'mypicker__cell--dim' : ''
                }`}
                onClick={() => onPick(browseYear, i)}
              >
                {m}
              </button>
            )
          })}
        </div>
      )}

      {mode === 'range' && <RangePicker onPick={onPick} />}
    </div>
  )
}
