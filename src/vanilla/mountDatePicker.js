import { createCalendar } from '../headless/createCalendar';
import { renderCalendarMarkup } from './render';
import { mountOrUpdateClassicCalendar } from './updateClassicCalendar';

export function createDatePicker(options = {}) {
  const {
    element,
    ui = 'classic',
    template,
    composeDayClasses,
    renderFooter,
    colorPrimary,
    colorPrimaryLight,
    slideAnimationDuration,
    calendarClassName,
    headless: headlessOptions,
    ...rest
  } = options;

  if (!element) {
    throw new TypeError('createDatePicker requires an `element` to mount into.');
  }

  const calendar = createCalendar({
    ...headlessOptions,
    ...rest,
  });

  const useClassic = ui !== 'tailwind';
  let prevSnapshot = null;

  const paint = (snapshot) => {
    if (useClassic) {
      mountOrUpdateClassicCalendar(
        element,
        snapshot,
        prevSnapshot,
        {
          colorPrimary,
          colorPrimaryLight,
          slideAnimationDuration,
          calendarClassName,
          renderFooter,
        },
        calendar,
      );
      prevSnapshot = snapshot;
    } else {
      element.innerHTML = renderCalendarMarkup(snapshot, {
        template,
        composeDayClasses,
        renderFooter,
      });
    }
  };

  const handleClick = (event) => {
    const target = event.target.closest(
      '[data-action],[data-day],[data-month-select],[data-year-select]',
    );
    if (target?.getAttribute('aria-disabled') === 'true') return;
    if (!target || !element.contains(target)) return;

    const action = target.getAttribute('data-action');
    if (action === 'prev-month') calendar.goToMonth('PREVIOUS');
    if (action === 'next-month') calendar.goToMonth('NEXT');
    if (action === 'toggle-month') calendar.toggleMonthSelector();
    if (action === 'toggle-year') calendar.toggleYearSelector();

    if (target.hasAttribute('data-month-select')) {
      calendar.selectMonth(Number(target.getAttribute('data-month-select')));
    }
    if (target.hasAttribute('data-year-select')) {
      calendar.selectYear(Number(target.getAttribute('data-year-select')));
    }
    if (target.hasAttribute('data-day')) {
      calendar.selectDay({
        day: Number(target.getAttribute('data-day')),
        month: Number(target.getAttribute('data-month')),
        year: Number(target.getAttribute('data-year')),
      });
    }
  };

  element.addEventListener('click', handleClick);
  const unsubscribe = calendar.subscribe(paint);

  const destroy = () => {
    element.removeEventListener('click', handleClick);
    unsubscribe();
    calendar.destroy();
    element.innerHTML = '';
  };

  return {
    calendar,
    destroy,
    render: () => paint(calendar.getSnapshot()),
  };
}
