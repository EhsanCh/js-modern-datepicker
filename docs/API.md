# API reference

Full TypeScript types: [`index.d.ts`](../index.d.ts) in the package root.

## Types

### `Day`

```ts
{ year: number; month: number; day: number }
```

### Value modes

| Initial `value` | Mode | `onChange` receives |
|-----------------|------|---------------------|
| `null` / `Day` | Single | `Day` or `null` |
| `{ from: Day \| null, to: Day \| null }` | Range | `{ from, to }` |
| `Day[]` (often `[]`) | Multiple | `Day[]` |

**Selection behavior**

- **Single:** `selectDay` sets/replaces the value.
- **Range:** first click sets `from`, second sets `to`; later clicks start a new range.
- **Multiple:** each click toggles that day in the array.

`getValueType(value)` from `js-modern-datepicker/headless` returns `'SINGLE_DATE'`, `'RANGE'`, or `'MUTLI_DATE'`.

### `Locale` (custom)

| Field | Purpose |
|-------|---------|
| `months`, `weekDays`, `weekStartingIndex` | Labels and grid layout |
| `getToday(gregorianToday)` | “Today” in calendar system |
| `toNativeDate(day)`, `getMonthLength(day)` | Date math |
| `transformDigit` | Localized numerals |
| `nextMonth`, `previousMonth`, selector labels | UI strings |
| `from`, `to`, `defaultPlaceholder`, `digitSeparator`, `yearLetterSkip` | Range input text & formatting |
| `isRtl` | Direction |

Built-ins: `'en'`, `'fa'`.

---

## Headless — `createCalendar(options)`

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `locale` | `'en'` \| `'fa'` \| `Locale` | `'en'` | Calendar language and RTL |
| `value` | see value modes | `null` | Current value; defines mode |
| `onChange` | `(value) => void` | noop | After value changes |
| `minimumDate` | `Day` \| `null` | `null` | Disable earlier days |
| `maximumDate` | `Day` \| `null` | `null` | Disable later days |
| `disabledDays` | `Day[]` | `[]` | Extra disabled days |
| `onDisabledDayError` | `(day) => void` | noop | User clicked a disabled day |
| `selectorStartingYear` | `number` \| `null` | today − 100 | Year selector start |
| `selectorEndingYear` | `number` \| `null` | today + 50 | Year selector end |
| `shouldHighlightWeekends` | `boolean` | `false` | Style weekends (`fa`: Fri; `en`: Sat/Sun) |
| `customDaysClassName` | `{ year, month, day, className }[]` | `[]` | Per-day CSS class |

### Controller methods

| Method | Description |
|--------|-------------|
| `subscribe(fn)` | `fn(snapshot)` on each update; returns unsubscribe |
| `getSnapshot()` | Current snapshot |
| `getValue()` / `setValue(value)` | Read/write value |
| `selectDay(day)` | Apply selection rules; calls `onChange` |
| `goToMonth('NEXT' \| 'PREVIOUS')` | Change visible month (not while selectors open) |
| `completeMonthTransition()` | End month-slide animation state (vanilla calls this) |
| `toggleMonthSelector()` / `toggleYearSelector()` | Toggle quick selectors |
| `selectMonth(n)` / `selectYear(y)` | Select from list; closes selector |
| `setActiveDate(day)` | Change visible month without changing `value` |
| `destroy()` | Tear down |

### `CalendarSnapshot`

Returned by `getSnapshot()` / Alpine `state`.

| Area | Fields |
|------|--------|
| Core | `locale`, `value`, `activeDate`, `isRtl` |
| Grid | `weekDays`, `weeks`, `slideWeeks` (second panel for classic slide) |
| Selectors | `months`, `years`, `isMonthSelectorOpen`, `isYearSelectorOpen` |
| Header | `header.monthLabel`, `header.yearLabel`, `header.previousDisabled`, `header.nextDisabled` |
| a11y | `labels.*` (month/year selector, prev/next month) |
| Animation | `monthChangeDirection`: `''`, `'NEXT'`, `'PREVIOUS'` |

### `CalendarDayCell` (each day in `weeks`)

Includes `year`, `month`, `day`, `label`, `ariaLabel`, `isStandard`, `isDisabled`, `isWeekend`, `customClassName`, and when applicable: `isToday`, `isSelected`, `isStartingDayRange`, `isEndingDayRange`, `isWithinRange`.

### Locale `utils(locale)`

From `js-modern-datepicker/headless`:

`getToday`, `getMonthName`, `getMonthNumber`, `getMonthLength`, `getMonthFirstWeekday`, `isBeforeDate`, `checkDayInDayRange`, `getLanguageDigits`.

Other exports: `getValueType`, `isSameDay`, `getDateAccordingToMonth`, constants (`TYPE_SINGLE_DATE`, …).

---

## Vanilla

### `createDatePicker(options)`

Extends calendar options with:

| Option | Description |
|--------|-------------|
| `element` | **Required.** Mount node |
| `ui` | `'classic'` (default) or `'tailwind'` |
| `colorPrimary` / `colorPrimaryLight` | Classic theme |
| `slideAnimationDuration` | e.g. `'0.4s'` |
| `calendarClassName` | Extra class on `.Calendar` |
| `renderFooter` | `(snapshot) => string` |
| `template` | Partial `TailwindTemplate` |
| `composeDayClasses` | `(day, template?) => string` |
| `headless` | Extra options merged into core |

**Returns:** `{ calendar, destroy(), render() }`.

### `createInputDatePicker(options)`

All `createDatePicker` options except `element`, plus:

| Option | Description |
|--------|-------------|
| `input` | **Required.** Element or CSS selector |
| `wrapper` | Optional; else `.DatePicker` wrapper is created |
| `calendarPopperPosition` | `'auto'` \| `'top'` \| `'bottom'` |
| `wrapperClassName` / `inputClassName` | CSS classes |
| `inputPlaceholder` | Default: locale `defaultPlaceholder` |
| `inputName` | Input `name` attribute |
| `formatInputText` | `(value) => string` — if truthy, shown in input |
| `closeOnSelect` | Override default close rules |
| `onOpen` / `onClose` | Popup hooks |

**Returns:** `{ calendar, input, wrapper, open(), close(), destroy(), render() }`.

**UX:** input is `readOnly`; click opens popup; outside click, **Escape**, or window `blur` closes.

**Default close:** single → on select; range → when both `from` and `to` set; multiple → stays open.

### `formatDatePickerInput(value, locale?, formatInputText?)`

Default when `formatInputText` is omitted:

- **Single:** `YYYY/MM/DD` (locale digits)
- **Range:** `{from} y/m/d {to} y/m/d` (empty until complete)
- **Multiple:** day numbers with `digitSeparator`

### Render helpers

| Export | Role |
|--------|------|
| `renderClassicCalendarMarkup(snapshot, options?)` | Classic HTML string |
| `enhanceClassicCalendarDom(root, snapshot)` | Post-render (animations, year scroll) |
| `renderCalendarMarkup(snapshot, options?)` | Tailwind HTML string |
| `composeTailwindDayClasses(day, template?)` | Default day classes |
| `tailwindTemplate` | Default class map (`js-modern-datepicker/templates/tailwind`) |

Classic `renderClassicCalendarMarkup` options: `colorPrimary`, `colorPrimaryLight`, `slideAnimationDuration`, `calendarClassName`, `renderFooter`.

---

## Tailwind UI

```js
createDatePicker({
  element: el,
  ui: 'tailwind',
  template: tailwindTemplate,
  value: null,
});
```

Ship your own Tailwind CSS; the package only provides class name strings. `TailwindTemplate` keys: `root`, `rootRtl`, `header`, `navButton`, `monthYearButton`, `weekDays`, `weekDay`, `weeks`, `weekRow`, `day`, `dayBlank`, `dayDisabled`, `dayWeekend`, `dayToday`, `daySelected`, `dayRangeStart`, `dayRangeEnd`, `dayRangeBetween`, `monthSelector`, `monthSelectorHidden`, `monthButton`, `monthButtonActive`, `yearSelector`, `yearSelectorHidden`, `yearButton`, `yearButtonActive`, `footer`.

---

## Alpine.js

### `registerCalendarDatepicker(Alpine, defaultOptions?)`

Registers `calendarDatepicker` and `calendarInputDatepicker`.

### `calendarDatepicker(options)`

Headless + your template. Instance:

| Property / method | Description |
|-------------------|-------------|
| `state` | `CalendarSnapshot` |
| `calendar` | Controller after `init` |
| `init`, `sync`, `destroy` | Lifecycle |
| `selectDay`, `goToMonth`, `completeMonthTransition` | Same as controller |
| `toggleMonthSelector`, `toggleYearSelector`, `selectMonth`, `selectYear` | Selectors |

### `calendarInputDatepicker(options)`

Same options as `createInputDatePicker`; `input` optional if `x-ref="input"`.

| Property / method | Description |
|-------------------|-------------|
| `picker` | Vanilla input picker instance |
| `calendar` | Headless controller |
| `isOpen` | Popup state |
| `open`, `close`, `destroy` | Control popup / cleanup (`$cleanup` on destroy when supported) |

---

## Package entry points

| Import | Contents |
|--------|----------|
| `js-modern-datepicker` | Barrel |
| `js-modern-datepicker/headless` | `createCalendar`, `utils`, helpers |
| `js-modern-datepicker/vanilla` | Date pickers + render helpers |
| `js-modern-datepicker/alpine` | Alpine factories + `registerCalendarDatepicker` |
| `js-modern-datepicker/templates/tailwind` | Tailwind template helpers |
| `js-modern-datepicker/templates/classic.css` | Classic stylesheet |

---

## Comparison with react-modern-calendar-datepicker

| React package | This library |
|---------------|--------------|
| `<DatePicker />` with input | `createInputDatePicker` / `calendarInputDatepicker` |
| `<Calendar />` | `createDatePicker` / custom + `calendarDatepicker` |
| `renderInput` | Not supported — use your own input + headless, or input picker API |
| `calendarTodayClassName`, range class props | Use `customDaysClassName` + `calendarClassName` |
| `calendarPopperPosition` | Supported on input picker |
