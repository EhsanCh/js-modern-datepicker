import { enhanceClassicCalendarDom, renderClassicCalendarMarkup } from './renderClassic';

const SELECTOR_CLOSE_MS = 550;

function getCalendarRoot(element) {
  return element.querySelector('.Calendar');
}

function parseAnimationDurationMs(calendarRoot) {
  const raw = getComputedStyle(calendarRoot).getPropertyValue('--animation-duration').trim();
  const match = raw.match(/^([\d.]+)(m?s)$/);
  if (!match) return 400;
  const value = parseFloat(match[1]);
  return match[2] === 's' ? value * 1000 : value;
}

function syncCalendarChrome(calendarRoot, snapshot) {
  const monthBtn = calendarRoot.querySelector('[data-action="toggle-month"]');
  const yearBtn = calendarRoot.querySelector('[data-action="toggle-year"]');
  const prevBtn = calendarRoot.querySelector('[data-action="prev-month"]');
  const nextBtn = calendarRoot.querySelector('[data-action="next-month"]');

  if (monthBtn) {
    monthBtn.textContent = snapshot.header.monthLabel;
    monthBtn.setAttribute(
      'aria-label',
      snapshot.isMonthSelectorOpen
        ? snapshot.labels.closeMonthSelector
        : snapshot.labels.openMonthSelector,
    );
    monthBtn.classList.toggle('-activeBackground', snapshot.isMonthSelectorOpen);
  }
  if (yearBtn) {
    yearBtn.textContent = snapshot.header.yearLabel;
    yearBtn.setAttribute(
      'aria-label',
      snapshot.isYearSelectorOpen
        ? snapshot.labels.closeYearSelector
        : snapshot.labels.openYearSelector,
    );
    yearBtn.classList.toggle('-activeBackground', snapshot.isYearSelectorOpen);
  }
  if (prevBtn) {
    prevBtn.disabled = snapshot.header.previousDisabled;
  }
  if (nextBtn) {
    nextBtn.disabled = snapshot.header.nextDisabled;
  }
}

function runMonthSlide(calendarRoot, direction, onComplete) {
  const wrapper = calendarRoot.querySelector('[data-testid="days-section-wrapper"]');
  if (!wrapper) {
    onComplete?.();
    return;
  }

  const sections = Array.from(wrapper.querySelectorAll('.Calendar__section'));
  if (sections.length < 2) {
    onComplete?.();
    return;
  }

  const shown = sections.find((section) => section.classList.contains('-shown'));
  const hidden = sections.find((section) => section !== shown);
  if (!shown || !hidden) {
    onComplete?.();
    return;
  }

  const isNext = direction === 'NEXT';
  const hiddenClass = (next) => (next ? '-hiddenNext' : '-hiddenPrevious');

  hidden.style.transition = 'none';
  shown.style.transition = '';
  shown.className = `Calendar__section ${hiddenClass(!isNext)}`;
  hidden.className = `Calendar__section ${hiddenClass(isNext)} -shownAnimated`;
  hidden.removeAttribute('aria-hidden');
  shown.setAttribute('aria-hidden', 'true');

  let completed = false;
  const finish = () => {
    if (completed) return;
    completed = true;
    hidden.classList.remove('-hiddenNext', '-hiddenPrevious');
    hidden.classList.replace('-shownAnimated', '-shown');
    hidden.style.transition = '';
    onComplete?.();
  };

  const duration = parseAnimationDurationMs(calendarRoot);
  const onAnimationEnd = (event) => {
    if (event.target !== hidden || event.animationName !== 'FadeContentToCenter') return;
    hidden.removeEventListener('animationend', onAnimationEnd);
    finish();
  };

  hidden.addEventListener('animationend', onAnimationEnd);
  window.setTimeout(finish, duration + 80);
}

function closeSelectorPanel(calendarRoot, selectorClass, onClosed) {
  const list = calendarRoot.querySelector(selectorClass);
  if (!list || !list.classList.contains('-open')) {
    onClosed();
    return;
  }
  list.classList.remove('-open');
  window.setTimeout(onClosed, SELECTOR_CLOSE_MS);
}

function shouldAnimateMonthSlide(snapshot, prev) {
  return (
    snapshot.monthChangeDirection &&
    !snapshot.isMonthSelectorOpen &&
    !snapshot.isYearSelectorOpen &&
    prev &&
    !prev.monthChangeDirection
  );
}

export function mountOrUpdateClassicCalendar(
  element,
  snapshot,
  prevSnapshot,
  renderOptions,
  calendar,
) {
  const calendarRoot = getCalendarRoot(element);

  if (
    calendarRoot &&
    prevSnapshot?.isMonthSelectorOpen &&
    !snapshot.isMonthSelectorOpen &&
    !snapshot.isYearSelectorOpen
  ) {
    syncCalendarChrome(calendarRoot, snapshot);
    closeSelectorPanel(calendarRoot, '.Calendar__monthSelector', () => {
      element.innerHTML = renderClassicCalendarMarkup(snapshot, renderOptions);
      enhanceClassicCalendarDom(element, snapshot);
    });
    return;
  }

  if (
    calendarRoot &&
    prevSnapshot?.isYearSelectorOpen &&
    !snapshot.isYearSelectorOpen &&
    !snapshot.isMonthSelectorOpen
  ) {
    syncCalendarChrome(calendarRoot, snapshot);
    closeSelectorPanel(calendarRoot, '.Calendar__yearSelector', () => {
      element.innerHTML = renderClassicCalendarMarkup(snapshot, renderOptions);
      enhanceClassicCalendarDom(element, snapshot);
    });
    return;
  }

  if (calendarRoot && shouldAnimateMonthSlide(snapshot, prevSnapshot)) {
    syncCalendarChrome(calendarRoot, snapshot);
    runMonthSlide(calendarRoot, snapshot.monthChangeDirection, () => {
      calendar.completeMonthTransition();
    });
    return;
  }

  element.innerHTML = renderClassicCalendarMarkup(snapshot, renderOptions);
  enhanceClassicCalendarDom(element, snapshot);
}
