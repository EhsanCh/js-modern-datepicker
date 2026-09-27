import { createCalendar } from '../headless/createCalendar';

/**
 * Alpine.data factory — use with x-data="calendarDatepicker({ locale: 'fa', ... })".
 * Pass Alpine via registerCalendarDatepicker for a global shortcut.
 */
export function calendarDatepicker(userOptions = {}) {
  return {
    calendar: null,
    state: {},
    init() {
      const { onChange, ...rest } = userOptions;
      this.calendar = createCalendar({
        ...rest,
        onChange: (value) => {
          if (typeof onChange === 'function') onChange(value);
          this.sync();
        },
      });
      this.calendar.subscribe((snapshot) => {
        this.state = snapshot;
      });
    },
    sync() {
      this.state = this.calendar.getSnapshot();
    },
    selectDay(day) {
      this.calendar.selectDay(day);
    },
    goToMonth(direction) {
      this.calendar.goToMonth(direction);
    },
    toggleMonthSelector() {
      this.calendar.toggleMonthSelector();
    },
    toggleYearSelector() {
      this.calendar.toggleYearSelector();
    },
    selectMonth(monthNumber) {
      this.calendar.selectMonth(monthNumber);
    },
    selectYear(year) {
      this.calendar.selectYear(year);
    },
    destroy() {
      this.calendar?.destroy();
    },
  };
}

export function registerCalendarDatepicker(Alpine, defaultOptions = {}) {
  Alpine.data('calendarDatepicker', (options) =>
    calendarDatepicker({ ...defaultOptions, ...options }),
  );
}

export default registerCalendarDatepicker;
