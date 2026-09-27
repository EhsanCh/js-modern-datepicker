function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function composeClassicDayClasses(day, isRtl) {
  const dir = isRtl ? '-rtl' : '-ltr';
  if (!day.isStandard) {
    return `Calendar__day ${dir} -blank`;
  }
  const classes = ['Calendar__day', dir];
  if (day.isDisabled) classes.push('-disabled');
  if (day.isWeekend) classes.push('-weekend');
  if (
    day.isToday &&
    !day.isSelected &&
    !day.isStartingDayRange &&
    !day.isEndingDayRange &&
    !day.isWithinRange
  ) {
    classes.push('-today');
  }
  if (day.isSelected) classes.push('-selected');
  if (day.isStartingDayRange) classes.push('-selectedStart');
  if (day.isEndingDayRange) classes.push('-selectedEnd');
  if (day.isWithinRange) classes.push('-selectedBetween');
  if (day.customClassName) classes.push(day.customClassName);
  return classes.join(' ');
}

export function renderClassicCalendarMarkup(snapshot, options = {}) {
  const {
    colorPrimary = '#0eca2d',
    colorPrimaryLight = '#cff4d5',
    slideAnimationDuration = '0.4s',
    calendarClassName = '',
    renderFooter,
  } = options;

  const isQuickSelectorOpen = snapshot.isMonthSelectorOpen || snapshot.isYearSelectorOpen;
  const arrowHidden = isQuickSelectorOpen ? '-hidden' : '';
  const rtl = snapshot.isRtl ? '-rtl' : '-ltr';
  const footerHtml = typeof renderFooter === 'function' ? renderFooter(snapshot) : '';

  const weekDayHeaders = snapshot.weekDays
    .map(
      (wd) =>
        `<abbr class="Calendar__weekDay" title="${escapeHtml(wd.name)}">${escapeHtml(
          wd.short,
        )}</abbr>`,
    )
    .join('');

  const weeksHtml = renderClassicWeeksHtml(snapshot.weeks, snapshot);
  const slideWeeksHtml = renderClassicWeeksHtml(snapshot.slideWeeks || snapshot.weeks, snapshot);

  const monthsHtml = snapshot.months
    .map(
      (m) =>
        `<li class="Calendar__monthSelectorItem${m.selected ? ' -active' : ''}"><button type="button" class="Calendar__monthSelectorItemText" data-month-select="${m.number}" ${m.disabled ? 'disabled' : ''} aria-pressed="${m.selected}">${escapeHtml(
          m.name,
        )}</button></li>`,
    )
    .join('');

  const yearsHtml = snapshot.years
    .map(
      (y) =>
        `<li class="Calendar__yearSelectorItem${y.selected ? ' -active' : ''}"><button type="button" class="Calendar__yearSelectorText" data-year-select="${y.value}" ${y.disabled ? 'disabled' : ''} aria-pressed="${y.selected}">${escapeHtml(
          y.label,
        )}</button></li>`,
    )
    .join('');

  const monthBtnClass = `Calendar__monthText${
    snapshot.isMonthSelectorOpen ? ' -activeBackground' : ''
  }`;
  const yearBtnClass = `Calendar__yearText${
    snapshot.isYearSelectorOpen ? ' -activeBackground' : ''
  }`;

  return `
<div class="Calendar -noFocusOutline ${rtl} ${calendarClassName}" role="grid" style="--cl-color-primary:${colorPrimary};--cl-color-primary-light:${colorPrimaryLight};--animation-duration:${slideAnimationDuration}">
  <div class="Calendar__header">
    <button type="button" class="Calendar__monthArrowWrapper -right ${arrowHidden}" data-action="prev-month" aria-label="${escapeHtml(
      snapshot.labels.previousMonth,
    )}" ${snapshot.header.previousDisabled ? 'disabled' : ''}>
      <span class="Calendar__monthArrow"></span>
    </button>
    <div class="Calendar__monthYearContainer">
      <div class="Calendar__monthYear -shown" role="presentation">
        <button type="button" class="${monthBtnClass}" data-action="toggle-month" aria-label="${escapeHtml(
          snapshot.isMonthSelectorOpen
            ? snapshot.labels.closeMonthSelector
            : snapshot.labels.openMonthSelector,
        )}">${escapeHtml(snapshot.header.monthLabel)}</button>
        <button type="button" class="${yearBtnClass}" data-action="toggle-year" aria-label="${escapeHtml(
          snapshot.isYearSelectorOpen
            ? snapshot.labels.closeYearSelector
            : snapshot.labels.openYearSelector,
        )}">${escapeHtml(snapshot.header.yearLabel)}</button>
      </div>
    </div>
    <button type="button" class="Calendar__monthArrowWrapper -left ${arrowHidden}" data-action="next-month" aria-label="${escapeHtml(
      snapshot.labels.nextMonth,
    )}" ${snapshot.header.nextDisabled ? 'disabled' : ''}>
      <span class="Calendar__monthArrow"></span>
    </button>
  </div>
  <div class="Calendar__monthSelectorAnimationWrapper" ${snapshot.isMonthSelectorOpen ? '' : 'aria-hidden="true"'}>
    <div class="Calendar__monthSelectorWrapper">
      <ul class="Calendar__monthSelector" data-animate-open="${snapshot.isMonthSelectorOpen ? 'true' : 'false'}" role="listbox">
        ${monthsHtml}
      </ul>
    </div>
  </div>
  <div class="Calendar__yearSelectorAnimationWrapper" ${snapshot.isYearSelectorOpen ? '' : 'aria-hidden="true"'}>
    <div class="Calendar__yearSelectorWrapper${snapshot.isYearSelectorOpen ? ' -faded' : ''}">
      <ul class="Calendar__yearSelector" data-animate-open="${snapshot.isYearSelectorOpen ? 'true' : 'false'}" role="listbox">
        ${yearsHtml}
      </ul>
    </div>
  </div>
  <div class="Calendar__weekDays">${weekDayHeaders}</div>
  <div class="Calendar__sectionWrapper" data-testid="days-section-wrapper" role="presentation">
    <div class="Calendar__section -shown" role="rowgroup">${weeksHtml}</div>
    <div class="Calendar__section -hiddenNext" role="rowgroup" aria-hidden="true">${slideWeeksHtml}</div>
  </div>
  ${footerHtml ? `<div class="Calendar__footer">${footerHtml}</div>` : ''}
</div>`.trim();
}

function renderClassicWeeksHtml(weeks, snapshot) {
  return weeks
    .map(
      (week) =>
        `<div class="Calendar__weekRow" role="row">${week
          .map((day) => {
            if (!day.isStandard) {
              return `<div class="${composeClassicDayClasses(day, snapshot.isRtl)}" role="gridcell" aria-hidden="true"></div>`;
            }
            const selected =
              day.isSelected || day.isStartingDayRange || day.isEndingDayRange || day.isWithinRange;
            const disabledAttr = day.isDisabled ? ' aria-disabled="true"' : '';
            const dataAttrs = day.isDisabled
              ? ''
              : ` data-day="${day.day}" data-month="${day.month}" data-year="${day.year}"`;
            return `<div class="${composeClassicDayClasses(day, snapshot.isRtl)}" role="gridcell"${dataAttrs} tabindex="${day.isDisabled ? '-1' : '0'}" aria-label="${escapeHtml(
              day.ariaLabel,
            )}" aria-selected="${selected}"${disabledAttr}>${escapeHtml(day.label)}</div>`;
          })
          .join('')}</div>`,
    )
    .join('');
}

export function enhanceClassicCalendarDom(root, snapshot) {
  const calendarRoot = root?.classList?.contains('Calendar')
    ? root
    : root?.querySelector?.('.Calendar');
  if (!calendarRoot) return;

  const monthList = calendarRoot.querySelector('.Calendar__monthSelector');
  const yearList = calendarRoot.querySelector('.Calendar__yearSelector');

  [monthList, yearList].forEach((list) => {
    if (list?.dataset.animateOpen === 'true') {
      list.classList.remove('-open');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => list.classList.add('-open'));
      });
    }
  });

  if (snapshot.isYearSelectorOpen) {
    const activeYear = calendarRoot.querySelector('.Calendar__yearSelectorItem.-active');
    if (activeYear && yearList) {
      yearList.scrollTop = activeYear.offsetTop - activeYear.offsetHeight * 5;
    }
  }
}
