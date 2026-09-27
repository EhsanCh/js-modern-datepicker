import { composeTailwindDayClasses, tailwindTemplate } from '../templates/tailwind';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderCalendarMarkup(snapshot, options = {}) {
  const template = options.template || tailwindTemplate;
  const composeDayClasses = options.composeDayClasses || composeTailwindDayClasses;
  const footerHtml =
    typeof options.renderFooter === 'function' ? options.renderFooter(snapshot) : '';

  const rootClasses = [template.root, snapshot.isRtl ? template.rootRtl : '']
    .filter(Boolean)
    .join(' ');

  const weekDayHeaders = snapshot.weekDays
    .map(
      (wd) =>
        `<abbr class="${template.weekDay}" title="${escapeHtml(wd.name)}">${escapeHtml(
          wd.short,
        )}</abbr>`,
    )
    .join('');

  const weeksHtml = snapshot.weeks
    .map(
      (week) =>
        `<div class="${template.weekRow}" role="row">${week
          .map((day) => {
            if (!day.isStandard) {
              return `<div class="${composeDayClasses(day, template)}" role="gridcell" aria-hidden="true"></div>`;
            }
            const selected =
              day.isSelected || day.isStartingDayRange || day.isEndingDayRange || day.isWithinRange;
            return `<button type="button" class="${composeDayClasses(day, template)}" role="gridcell" data-day="${day.day}" data-month="${day.month}" data-year="${day.year}" aria-label="${escapeHtml(
              day.ariaLabel,
            )}" aria-selected="${selected}" ${day.isDisabled ? 'disabled' : ''}>${escapeHtml(
              day.label,
            )}</button>`;
          })
          .join('')}</div>`,
    )
    .join('');

  const monthSelectorClass = snapshot.isMonthSelectorOpen
    ? template.monthSelector
    : `${template.monthSelector} ${template.monthSelectorHidden}`;
  const monthsHtml = snapshot.months
    .map(
      (m) =>
        `<button type="button" class="${template.monthButton}${
          m.selected ? ` ${template.monthButtonActive}` : ''
        }" data-month-select="${m.number}" ${m.disabled ? 'disabled' : ''} aria-pressed="${m.selected}">${escapeHtml(
          m.name,
        )}</button>`,
    )
    .join('');

  const yearSelectorClass = snapshot.isYearSelectorOpen
    ? template.yearSelector
    : `${template.yearSelector} ${template.yearSelectorHidden}`;
  const yearsHtml = snapshot.years
    .map(
      (y) =>
        `<button type="button" class="${template.yearButton}${
          y.selected ? ` ${template.yearButtonActive}` : ''
        }" data-year-select="${y.value}" ${y.disabled ? 'disabled' : ''} aria-pressed="${y.selected}">${escapeHtml(
          y.label,
        )}</button>`,
    )
    .join('');

  return `
<div class="${rootClasses}" role="grid" dir="${snapshot.isRtl ? 'rtl' : 'ltr'}">
  <div class="${template.header}">
    <button type="button" class="${template.navButton}" data-action="prev-month" aria-label="${escapeHtml(
      snapshot.labels.previousMonth,
    )}" ${snapshot.header.previousDisabled ? 'disabled' : ''} aria-hidden="true">‹</button>
    <div class="flex items-center gap-1">
      <button type="button" class="${template.monthYearButton}" data-action="toggle-month" aria-label="${escapeHtml(
        snapshot.isMonthSelectorOpen
          ? snapshot.labels.closeMonthSelector
          : snapshot.labels.openMonthSelector,
      )}">${escapeHtml(snapshot.header.monthLabel)}</button>
      <button type="button" class="${template.monthYearButton}" data-action="toggle-year" aria-label="${escapeHtml(
        snapshot.isYearSelectorOpen
          ? snapshot.labels.closeYearSelector
          : snapshot.labels.openYearSelector,
      )}">${escapeHtml(snapshot.header.yearLabel)}</button>
    </div>
    <button type="button" class="${template.navButton}" data-action="next-month" aria-label="${escapeHtml(
      snapshot.labels.nextMonth,
    )}" ${snapshot.header.nextDisabled ? 'disabled' : ''} aria-hidden="true">›</button>
  </div>
  <div class="${monthSelectorClass}" role="listbox">${monthsHtml}</div>
  <div class="${yearSelectorClass}" role="listbox">${yearsHtml}</div>
  <div class="${template.weekDays}">${weekDayHeaders}</div>
  <div class="${template.weeks}">${weeksHtml}</div>
  ${footerHtml ? `<div class="${template.footer}">${footerHtml}</div>` : ''}
</div>`.trim();
}
