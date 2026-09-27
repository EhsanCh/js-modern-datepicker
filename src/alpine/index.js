import { createCalendar } from '../headless/createCalendar';
import { createInputDatePicker } from '../vanilla/inputDatePicker';

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
    completeMonthTransition() {
      this.calendar.completeMonthTransition();
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

/**
 * Input + popup (classic UI). Markup:
 * <div x-data="calendarInputDatepicker({ locale: 'fa' })">
 *   <input x-ref="input" type="text" />
 * </div>
 */
export function calendarInputDatepicker(userOptions = {}) {
  return {
    picker: null,
    calendar: null,
    isOpen: false,
    init() {
      const { onChange, onOpen, onClose, input: inputOption, ...rest } = userOptions;
      const input = inputOption ?? this.$refs.input;
      if (!input) {
        throw new Error(
          'calendarInputDatepicker: provide `input` or add x-ref="input" on the field element.',
        );
      }

      this.picker = createInputDatePicker({
        ui: 'classic',
        ...rest,
        input,
        onChange: (value) => {
          if (typeof onChange === 'function') onChange(value);
          this.calendar = this.picker.calendar;
        },
        onOpen: () => {
          this.isOpen = true;
          if (typeof onOpen === 'function') onOpen();
        },
        onClose: () => {
          this.isOpen = false;
          if (typeof onClose === 'function') onClose();
        },
      });
      this.calendar = this.picker.calendar;

      if (typeof this.$cleanup === 'function') {
        this.$cleanup(() => this.picker?.destroy());
      }
    },
    open() {
      this.picker?.open();
    },
    close() {
      this.picker?.close();
    },
    destroy() {
      this.picker?.destroy();
      this.picker = null;
      this.calendar = null;
    },
  };
}

export function registerCalendarDatepicker(Alpine, defaultOptions = {}) {
  Alpine.data('calendarDatepicker', (options) =>
    calendarDatepicker({ ...defaultOptions, ...options }),
  );
  Alpine.data('calendarInputDatepicker', (options) =>
    calendarInputDatepicker({ ...defaultOptions, ...options }),
  );
}

export default registerCalendarDatepicker;
