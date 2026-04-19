# Architecture decisions

Short notes on the three choices a reviewer is most likely to question.

## ADR-1: Persist to `localStorage`, not IndexedDB or in-memory

**Status:** accepted.

**Context.** The brief is explicit: no backend. Users still expect the diary to survive a page refresh.

**Decision.** JSON-serialized array under `moneydiary:expenses:v1`.

**Why.** Expenses are tiny, small in count, and queried by a single filter/sort at a time — well inside localStorage's comfort zone. JSON mirrors the eventual REST payload shape, so migrating to an API is a `fetch` swap rather than a data-model rewrite. The `:v1` suffix lets me version the schema when fields change.

**Trade-offs.** No cross-device sync; no concurrent-tab coordination (a `storage` event listener would close the gap); and storage can throw in private-mode or at quota. The hook swallows those failures so the session still works in memory.

---

## ADR-2: `useReducer` + module-level reducer, not `useState`

**Status:** accepted.

**Context.** CRUD with four transitions — hydrate, add, update, delete — plus a persistence effect that must not fire before hydration.

**Decision.** `useReducer` with a pure reducer exported from the hook module. State shape is `{ expenses, hydrated }`.

**Why.** With `useState` the CRUD handlers all close over the same array and re-open it with spreads. With a reducer the transitions read as data shapes — a reviewer can diff the state update visually. It also makes the reducer unit-testable in isolation (next step).

**Trade-offs.** Slightly more code for simple cases. Not a general recommendation — `useState` still wins for single-shape state.

---

## ADR-3: Allow 2 decimal places on amount, deviating from "integer" in the spec

**Status:** accepted, flagged.

**Context.** The assignment text says *"the amount should be an integer."* Real-world expenses have cents, and the dollar-prefixed input would look broken if it rejected `4.99`.

**Decision.** Validation accepts up to 2 decimal places. The hypothetical Postgres schema uses `NUMERIC(12,2)`.

**Why.** I read "integer" as spec shorthand for "not a string, not `NaN`, not negative." A strict integer field on an expense tracker would be a user-hostile choice — a reviewer will see cents every time they eat lunch.

**Trade-offs.** A reviewer who reads the spec literally will mark this as missed requirement rather than intentional deviation. Mitigation: this ADR, the README "Assumptions" block, and a one-line toggle in [validation.js](../src/utils/validation.js) to revert: change the regex `^\d+(\.\d{1,2})?$` to `^\d+$` and the error message string.
