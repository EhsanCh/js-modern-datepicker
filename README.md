# js-modern-datepicker

Headless Persian (Jalali) and Gregorian calendar and date picker. Ship your own UI, or use the built-in **classic** skin or optional **Tailwind** templates. **Vanilla JS** and **Alpine.js** adapters included — no React.

**Author:** [Ehsan Chavoshi](https://github.com/EhsanCh)

**Live demo:** [ehsanch.github.io/js-modern-datepicker](https://ehsanch.github.io/js-modern-datepicker/) (classic UI; deployed from `demo/` on GitHub Pages)

**API reference:** [docs/API.md](docs/API.md) — options, methods, value types, exports, and React package comparison.

## Install

```bash
npm install js-modern-datepicker
```

When using the classic UI or input popup, load the stylesheet once:

```js
require('js-modern-datepicker/templates/classic.css');
// or in bundlers: import 'js-modern-datepicker/templates/classic.css';
```

## Features (overview)

- **Calendars:** Jalali (`locale: 'fa'`) and Gregorian (`locale: 'en'`), or a custom `Locale` object (RTL/LTR, localized labels and digits).
- **Value modes** — inferred from `value` (see [API — Value types](docs/API.md#value-modes)):
  - Single: `null` or `{ year, month, day }`
  - Range: `{ from: Day | null, to: Day | null }`
  - Multiple: `[]` or an array of days
- **Adapters:** headless (`createCalendar`), vanilla inline (`createDatePicker`), vanilla input popup (`createInputDatePicker`), Alpine (`calendarDatepicker`, `calendarInputDatepicker`).
- **UI skins:** classic CSS (default) or Tailwind class map (`ui: 'tailwind'`).
- **Constraints & styling:** min/max date, disabled days, weekends, per-day CSS classes, classic theme colors, animated month change and month/year panels.
- **Input popup:** formatted read-only field, optional custom `formatInputText`, popper placement, open/close hooks.

TypeScript: [`index.d.ts`](index.d.ts).

## Quick start

### Headless (state only)

```js
const { createCalendar } = require('js-modern-datepicker/headless');

const calendar = createCalendar({
  locale: 'fa',
  value: null,
  onChange(value) {
    console.log(value);
  },
});

calendar.subscribe((snapshot) => {
  // snapshot.weeks, snapshot.months, snapshot.header, …
});

calendar.selectDay({ year: 1404, month: 1, day: 1 });
```

### Vanilla — inline calendar

```js
const { createDatePicker } = require('js-modern-datepicker/vanilla');
require('js-modern-datepicker/templates/classic.css');

createDatePicker({
  element: document.getElementById('calendar'),
  locale: 'fa',
  ui: 'classic',
  value: null,
  onChange(value) {
    console.log(value);
  },
});
```

### Vanilla — input + popup

```js
const { createInputDatePicker } = require('js-modern-datepicker/vanilla');
require('js-modern-datepicker/templates/classic.css');

const picker = createInputDatePicker({
  input: '#my-date',
  locale: 'fa',
  value: null,
  onChange(value) {
    console.log(value);
  },
});
// picker.open(), picker.close(), picker.destroy()
```

### Alpine.js

```js
import Alpine from 'alpinejs';
import { registerCalendarDatepicker } from 'js-modern-datepicker/alpine';
import 'js-modern-datepicker/templates/classic.css';

registerCalendarDatepicker(Alpine);
Alpine.start();
```

```html
<div x-data="calendarInputDatepicker({ locale: 'fa', value: null })">
  <input x-ref="input" type="text" />
</div>
```

More examples (Tailwind, `formatDatePickerInput`, render helpers, full option lists): **[docs/API.md](docs/API.md)**.

## Package exports

| Import | Contents |
|--------|----------|
| `js-modern-datepicker` | Barrel |
| `js-modern-datepicker/headless` | `createCalendar`, `utils`, `getValueType`, … |
| `js-modern-datepicker/vanilla` | `createDatePicker`, `createInputDatePicker`, `formatDatePickerInput`, render helpers |
| `js-modern-datepicker/alpine` | `calendarDatepicker`, `calendarInputDatepicker`, `registerCalendarDatepicker` |
| `js-modern-datepicker/templates/tailwind` | `tailwindTemplate`, `composeTailwindDayClasses` |
| `js-modern-datepicker/templates/classic.css` | Classic skin |

## Demo

**Online:** [https://ehsanch.github.io/js-modern-datepicker/](https://ehsanch.github.io/js-modern-datepicker/) — deployed from `demo/` on push to `main`.

Includes `createInputDatePicker`, inline single/range/multiple, and Jalali sample.

**Local:** `npm install` → `npm run demo` → [http://localhost:4173](http://localhost:4173).

## Development

```bash
npm run build    # compile lib/
npm test         # unit tests
npm run checkAll # size limit, prettier, tests
```

## Origin / credits

**js-modern-datepicker** (from 1.0.0) is a headless rewrite with vanilla and Alpine adapters, maintained by Ehsan Chavoshi.

The **classic** stylesheet and overall UX are ported from:

- [react-modern-calendar-datepicker](https://github.com/Kiarash-Z/react-modern-calendar-datepicker) by **Kiarash Zarinmehr** (MIT)

See [API — Comparison with react-modern-calendar-datepicker](docs/API.md#comparison-with-react-modern-calendar-datepicker).

## License

[MIT](LICENSE). Copyright (c) Ehsan Chavoshi; portions derived from the upstream project credited above retain the original author’s copyright notice in `LICENSE`.
