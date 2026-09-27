export type Day = {
  year: number;
  month: number;
  day: number;
};

export type DayValue = Day | null | undefined;

export type DayRange = { from: DayValue; to: DayValue };

type Value = DayValue | Day[] | DayRange;

type CustomDayClassNameItem = Day & { className: string };

export interface Locale {
  months: string[];
  weekDays: { name: string; short: string; isWeekend?: boolean }[];
  weekStartingIndex: number;
  getToday(gregorianToday: Day): Day;
  toNativeDate(date: Day): Date;
  getMonthLength(date: Day): number;
  transformDigit(digit: number | string): string;
  nextMonth: string;
  previousMonth: string;
  openMonthSelector: string;
  openYearSelector: string;
  closeMonthSelector: string;
  closeYearSelector: string;
  from: string;
  to: string;
  defaultPlaceholder: string;
  digitSeparator: string;
  yearLetterSkip: number;
  isRtl: boolean;
}

export interface CalendarOptions<TValue extends Value = DayValue> {
  locale?: string | Locale;
  value?: TValue;
  minimumDate?: Day | null;
  maximumDate?: Day | null;
  disabledDays?: Day[];
  selectorStartingYear?: number | null;
  selectorEndingYear?: number | null;
  shouldHighlightWeekends?: boolean;
  customDaysClassName?: CustomDayClassNameItem[];
  onChange?: (value: TValue) => void;
  onDisabledDayError?: (day: Day) => void;
}

export interface CalendarDayCell extends Day {
  id: string;
  isStandard: boolean;
  isDisabled: boolean;
  isWeekend: boolean;
  label: string;
  ariaLabel: string;
  customClassName: string;
  isToday?: boolean;
  isSelected?: boolean;
  isStartingDayRange?: boolean;
  isEndingDayRange?: boolean;
  isWithinRange?: boolean;
}

export interface CalendarSnapshot<TValue extends Value = DayValue> {
  locale: string | Locale;
  value: TValue;
  activeDate: Day;
  isMonthSelectorOpen: boolean;
  isYearSelectorOpen: boolean;
  isRtl: boolean;
  weekDays: Locale['weekDays'];
  weeks: CalendarDayCell[][];
  slideWeeks: CalendarDayCell[][];
  monthChangeDirection: '' | 'NEXT' | 'PREVIOUS';
  months: { name: string; number: number; disabled: boolean; selected: boolean }[];
  years: { value: number; label: string; disabled: boolean; selected: boolean }[];
  header: {
    monthLabel: string;
    yearLabel: string;
    previousDisabled: boolean;
    nextDisabled: boolean;
  };
  labels: {
    nextMonth: string;
    previousMonth: string;
    openMonthSelector: string;
    closeMonthSelector: string;
    openYearSelector: string;
    closeYearSelector: string;
  };
}

export interface CalendarController<TValue extends Value = DayValue> {
  subscribe(listener: (snapshot: CalendarSnapshot<TValue>) => void): () => void;
  getSnapshot(): CalendarSnapshot<TValue>;
  getValue(): TValue;
  setValue(value: TValue): void;
  selectDay(day: Day): void;
  goToMonth(direction: 'NEXT' | 'PREVIOUS'): void;
  completeMonthTransition(): void;
  toggleMonthSelector(): void;
  toggleYearSelector(): void;
  selectMonth(monthNumber: number): void;
  selectYear(year: number): void;
  setActiveDate(date: Day): void;
  destroy(): void;
}

export function createCalendar<TValue extends Value = DayValue>(
  options?: CalendarOptions<TValue>,
): CalendarController<TValue>;

export const utils: (locale?: string | Locale) => {
  getToday(): Day;
  getMonthName(month: number): string;
  getMonthNumber(monthName: string): number;
  getMonthLength(date: Day): number;
  getMonthFirstWeekday(date: Day): number;
  isBeforeDate(day1: Day, day2: Day): boolean;
  checkDayInDayRange(params: { day: Day; from: Day; to: Day }): boolean;
  getLanguageDigits(digit: number | string): string;
};

export interface TailwindTemplate {
  root: string;
  rootRtl: string;
  header: string;
  navButton: string;
  monthYearButton: string;
  weekDays: string;
  weekDay: string;
  weeks: string;
  weekRow: string;
  day: string;
  dayBlank: string;
  dayDisabled: string;
  dayWeekend: string;
  dayToday: string;
  daySelected: string;
  dayRangeStart: string;
  dayRangeEnd: string;
  dayRangeBetween: string;
  monthSelector: string;
  monthSelectorHidden: string;
  monthButton: string;
  monthButtonActive: string;
  yearSelector: string;
  yearSelectorHidden: string;
  yearButton: string;
  yearButtonActive: string;
  footer: string;
}

export const tailwindTemplate: TailwindTemplate;

export function composeTailwindDayClasses(
  day: CalendarDayCell,
  template?: TailwindTemplate,
): string;

export interface DatePickerMountOptions<TValue extends Value = DayValue>
  extends CalendarOptions<TValue> {
  element: HTMLElement;
  template?: Partial<TailwindTemplate>;
  composeDayClasses?: (day: CalendarDayCell, template?: TailwindTemplate) => string;
  renderFooter?: (snapshot: CalendarSnapshot<TValue>) => string;
  headless?: CalendarOptions<TValue>;
}

export function createDatePicker<TValue extends Value = DayValue>(
  options: DatePickerMountOptions<TValue>,
): {
  calendar: CalendarController<TValue>;
  destroy(): void;
  render(): void;
};

export function renderCalendarMarkup<TValue extends Value = DayValue>(
  snapshot: CalendarSnapshot<TValue>,
  options?: {
    template?: Partial<TailwindTemplate>;
    composeDayClasses?: (day: CalendarDayCell, template?: TailwindTemplate) => string;
    renderFooter?: (snapshot: CalendarSnapshot<TValue>) => string;
  },
): string;

export function calendarDatepicker<TValue extends Value = DayValue>(
  userOptions?: CalendarOptions<TValue>,
): {
  calendar: CalendarController<TValue> | null;
  state: CalendarSnapshot<TValue>;
  init(): void;
  sync(): void;
  selectDay(day: Day): void;
  goToMonth(direction: 'NEXT' | 'PREVIOUS'): void;
  completeMonthTransition(): void;
  toggleMonthSelector(): void;
  toggleYearSelector(): void;
  selectMonth(monthNumber: number): void;
  selectYear(year: number): void;
  destroy(): void;
};

export function registerCalendarDatepicker(
  Alpine: { data: (name: string, factory: (options?: CalendarOptions) => unknown) => void },
  defaultOptions?: CalendarOptions,
): void;
