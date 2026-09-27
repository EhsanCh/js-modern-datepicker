# js-modern-datepicker

Headless Persian (Jalali) and Gregorian calendar and date picker. Ship your own UI, or use the built-in **classic** skin or optional **Tailwind** templates. **Vanilla JS** and **Alpine.js** adapters included — no React.

**Author:** [Ehsan Chavoshi](https://github.com/EhsanCh)

**Live demo:** [ehsanch.github.io/js-modern-datepicker](https://ehsanch.github.io/js-modern-datepicker/) (classic UI; deployed from `demo/` on GitHub Pages)

## Install

```bash
npm install js-modern-datepicker
```

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

### Vanilla (DOM + classic UI)

```js
const { createDatePicker } = require('js-modern-datepicker/vanilla');
require('js-modern-datepicker/templates/classic.css');

createDatePicker({
  element: document.getElementById('calendar'),
  locale: 'fa',
  ui: 'classic', // default
  value: null,
  onChange(value) {
    console.log(value);
  },
});
```

Value shapes: single `{ year, month, day }`, range `{ from, to }`, or multiple dates `[{ … }, …]`.

### Alpine.js

```js
import Alpine from 'alpinejs';
import { registerCalendarDatepicker } from 'js-modern-datepicker/alpine';

registerCalendarDatepicker(Alpine);
Alpine.start();
```

```html
<div
  x-data="calendarDatepicker({ locale: 'fa', value: null })"
  x-html="render()"
></div>
```

See `index.d.ts` and `src/` for the full API (`goToMonth`, min/max dates, disabled days, etc.).

## Package exports

| Import | Description |
|--------|-------------|
| `js-modern-datepicker` | Barrel re-exports |
| `js-modern-datepicker/headless` | `createCalendar`, utils |
| `js-modern-datepicker/vanilla` | `createDatePicker`, render helpers |
| `js-modern-datepicker/alpine` | `calendarDatepicker`, `registerCalendarDatepicker` |
| `js-modern-datepicker/templates/tailwind` | Tailwind class map |
| `js-modern-datepicker/templates/classic.css` | Classic skin (CSS) |

## Demo

**Online:** [https://ehsanch.github.io/js-modern-datepicker/](https://ehsanch.github.io/js-modern-datepicker/) — updates on every push to `main` (workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml)).

**Local:**

```bash
npm install
npm run demo
```

Open [http://localhost:4173](http://localhost:4173).

## Development

```bash
npm run build    # compile lib/
npm test         # unit tests
npm run checkAll # size limit, prettier, tests
```

## Origin / credits

**js-modern-datepicker** (from 1.0.0) is a headless rewrite with vanilla and Alpine adapters, maintained by Ehsan Chavoshi.

The **classic** stylesheet and overall UX are ported from the first version of this work:

- [react-modern-calendar-datepicker](https://github.com/Kiarash-Z/react-modern-calendar-datepicker) by **Kiarash Zarinmehr** (MIT)

Thank you to the original author and contributors for the calendar design and behavior that this package builds on.

## License

[MIT](LICENSE). Copyright (c) Ehsan Chavoshi; portions derived from the upstream project credited above retain the original author’s copyright notice in `LICENSE`.
