/**
 * Optional Tailwind class map for the default vanilla renderer.
 * Override any key or pass `composeDayClasses` for full control.
 */
export const tailwindTemplate = {
  root: 'mcd-calendar rounded-xl border border-gray-200 bg-white p-4 shadow-lg text-gray-900',
  rootRtl: 'mcd-calendar-rtl',
  header: 'mcd-calendar__header flex items-center justify-between gap-2 mb-3',
  navButton:
    'mcd-calendar__nav inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none',
  monthYearButton:
    'mcd-calendar__month-year rounded-lg px-2 py-1 text-sm font-semibold hover:bg-gray-100',
  weekDays: 'mcd-calendar__weekdays grid grid-cols-7 gap-1 mb-1',
  weekDay: 'mcd-calendar__weekday text-center text-xs font-medium text-gray-500',
  weeks: 'mcd-calendar__weeks space-y-1',
  weekRow: 'mcd-calendar__week grid grid-cols-7 gap-1',
  day: 'mcd-calendar__day h-9 w-full rounded-lg text-sm flex items-center justify-center transition-colors',
  dayBlank: 'mcd-calendar__day-blank pointer-events-none',
  dayDisabled: 'opacity-40 cursor-not-allowed',
  dayWeekend: 'text-rose-600',
  dayToday: 'ring-2 ring-emerald-500 ring-inset',
  daySelected: 'bg-emerald-500 text-white font-semibold hover:bg-emerald-600',
  dayRangeStart: 'bg-emerald-500 text-white font-semibold rounded-l-full rounded-r-none',
  dayRangeEnd: 'bg-emerald-500 text-white font-semibold rounded-r-full rounded-l-none',
  dayRangeBetween: 'bg-emerald-200/90 text-emerald-950 font-medium rounded-none',
  monthSelector:
    'mcd-calendar__month-selector grid grid-cols-3 gap-2 p-2 border border-gray-200 rounded-lg mb-3',
  monthSelectorHidden: 'hidden',
  monthButton:
    'mcd-calendar__month-item rounded-lg px-2 py-2 text-sm hover:bg-gray-100 disabled:opacity-40',
  monthButtonActive: 'bg-emerald-500 text-white hover:bg-emerald-600',
  yearSelector:
    'mcd-calendar__year-selector max-h-48 overflow-y-auto border border-gray-200 rounded-lg mb-3 p-1',
  yearSelectorHidden: 'hidden',
  yearButton:
    'mcd-calendar__year-item w-full rounded-lg px-2 py-1.5 text-sm text-left hover:bg-gray-100 disabled:opacity-40',
  yearButtonActive: 'bg-emerald-100 text-emerald-800 font-medium',
  footer: 'mcd-calendar__footer mt-3 border-t border-gray-100 pt-3',
};

export function composeTailwindDayClasses(day, template = tailwindTemplate) {
  if (!day.isStandard) {
    return [template.day, template.dayBlank].filter(Boolean).join(' ');
  }
  const classes = [template.day];
  if (day.isDisabled) classes.push(template.dayDisabled);
  if (day.isWeekend) classes.push(template.dayWeekend);
  if (day.isToday && !day.isSelected) classes.push(template.dayToday);
  if (day.isSelected) classes.push(template.daySelected);
  if (day.isStartingDayRange) classes.push(template.dayRangeStart);
  if (day.isEndingDayRange) classes.push(template.dayRangeEnd);
  if (day.isWithinRange) classes.push(template.dayRangeBetween);
  if (day.customClassName) classes.push(day.customClassName);
  return classes.join(' ');
}

export default tailwindTemplate;
