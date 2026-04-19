import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onClose }) {
  const dialogRef = useRef(null)
  const confirmRef = useRef(null)
  const previouslyFocused = useRef(null)
  const mouseDownTarget = useRef(null)

  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement
    confirmRef.current?.focus()

    function onKey(ev) {
      if (ev.key === 'Escape') {
        ev.preventDefault()
        onClose()
        return
      }
      if (ev.key !== 'Tab' || !dialogRef.current) return
      const nodes = dialogRef.current.querySelectorAll(FOCUSABLE)
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (ev.shiftKey && document.activeElement === first) {
        ev.preventDefault()
        last.focus()
      } else if (!ev.shiftKey && document.activeElement === last) {
        ev.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus()
      }
    }
  }, [open, onClose])

  if (!open) return null

  function handleBackdropMouseDown(ev) {
    mouseDownTarget.current = ev.target
  }
  function handleBackdropClick(ev) {
    if (mouseDownTarget.current === ev.currentTarget && ev.target === ev.currentTarget) {
      onClose()
    }
    mouseDownTarget.current = null
  }

  return (
    <div
      className="modal-root"
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <h3 id="confirm-title" className="modal__title">
          {title}
        </h3>
        <p className="modal__text">{message}</p>
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
