import localeUtils from '../shared/localeUtils';
import getLocaleDetails from '../shared/localeLanguages';
import {
  createUniqueRange,
  deepCloneObject,
  getDateAccordingToMonth,
  getValueType,
  isSameDay,
  shallowClone,
} from '../shared/generalUtils';
import {
  MAXIMUM_SELECTABLE_YEAR_SUM,
  MINIMUM_SELECTABLE_YEAR_SUBTRACT,
  TYPE_MUTLI_DATE,
  TYPE_RANGE,
  TYPE_SINGLE_DATE,
} from '../shared/constants';

const defaultOptions = {
  locale: 'en',
  value: null,
  minimumDate: null,
  maximumDate: null,
  disabledDays: [],
  selectorStartingYear: null,
  selectorEndingYear: null,
  shouldHighlightWeekends: false,
  customDaysClassName: [],
  onChange: () => {},
  onDisabledDayError: () => {},
};

function getComputedActiveDate(value, getToday) {
  const valueType = getValueType(value);
  if (valueType === TYPE_MUTLI_DATE && value.length) return shallowClone(value[0]);
  if (valueType === TYPE_SINGLE_DATE && value) return shallowClone(value);
  if (valueType === TYPE_RANGE && value.from) return shallowClone(value.from);
  return shallowClone(getToday());
}

function getDayRangeValue(day, value, disabledDays, locale, onDisabledDayError) {
  const { isBeforeDate, checkDayInDayRange } = localeUtils(locale);
  const clonedDayRange = deepCloneObject(value);
  const dayRangeValue =
    clonedDayRange.from && clonedDayRange.to ? { from: null, to: null } : clonedDayRange;
  const dayRangeProp = !dayRangeValue.from ? 'from' : 'to';
  dayRangeValue[dayRangeProp] = day;
  const { from, to } = dayRangeValue;

  if (isBeforeDate(dayRangeValue.to, dayRangeValue.from)) {
    dayRangeValue.from = to;
    dayRangeValue.to = from;
  }

  const includingDisabledDay = disabledDays.find((disabledDay) =>
    checkDayInDayRange({
      day: disabledDay,
      from: dayRangeValue.from,
      to: dayRangeValue.to,
    }),
  );
  if (includingDisabledDay) {
    onDisabledDayError(includingDisabledDay);
    return value;
  }

  return dayRangeValue;
}

function getMultiDateValue(day, value) {
  const isAlreadyExisting = value.some((valueDay) => isSameDay(valueDay, day));
  if (isAlreadyExisting) {
    return value.filter((valueDay) => !isSameDay(valueDay, day));
  }
  return [...value, day];
}

function resolveNewValue(day, value, disabledDays, locale, onDisabledDayError) {
  const valueType = getValueType(value);
  switch (valueType) {
    case TYPE_SINGLE_DATE:
      return day;
    case TYPE_RANGE:
      return getDayRangeValue(day, value, disabledDays, locale, onDisabledDayError);
    case TYPE_MUTLI_DATE:
      return getMultiDateValue(day, value);
    default:
      return day;
  }
}

function buildMonthDays(activeDate, options, localeApi, weekDaysList) {
  const {
    getMonthFirstWeekday,
    getMonthLength,
    getLanguageDigits,
    getMonthName,
    isBeforeDate,
    checkDayInDayRange,
    getToday,
  } = localeApi;
  const {
    value,
    minimumDate,
    maximumDate,
    disabledDays,
    shouldHighlightWeekends,
    customDaysClassName,
  } = options;
  const today = getToday();

  const prependingBlankDays = createUniqueRange(getMonthFirstWeekday(activeDate), 'starting-blank');
  const standardDays = createUniqueRange(getMonthLength(activeDate)).map((day) => ({
    ...day,
    isStandard: true,
    month: activeDate.month,
    year: activeDate.year,
  }));
  const allDays = [...prependingBlankDays, ...standardDays];

  const isSingleDateSelected = (day) => {
    const valueType = getValueType(value);
    if (valueType === TYPE_SINGLE_DATE) return isSameDay(day, value);
    if (valueType === TYPE_MUTLI_DATE) return value.some((valueDay) => isSameDay(valueDay, day));
    return false;
  };

  const getDayStatus = (dayItem) => {
    const isToday = isSameDay(dayItem, today);
    const isSelected = isSingleDateSelected(dayItem);
    const { from: startingDay, to: endingDay } = value || {};
    const isStartingDayRange = isSameDay(dayItem, startingDay);
    const isEndingDayRange = isSameDay(dayItem, endingDay);
    const isWithinRange = checkDayInDayRange({ day: dayItem, from: startingDay, to: endingDay });
    return { isToday, isSelected, isStartingDayRange, isEndingDayRange, isWithinRange };
  };

  const weeks = [];
  for (let weekRowIndex = 0; weekRowIndex < 6; weekRowIndex += 1) {
    const row = allDays.slice(weekRowIndex * 7, weekRowIndex * 7 + 7).map((cell, index) => {
      const dayItem = { day: cell.value, month: cell.month, year: cell.year };
      const isStandard = Boolean(cell.isStandard);
      const columnIndex = index;
      const isInDisabledDaysRange =
        isStandard && disabledDays.some((disabledDay) => isSameDay(dayItem, disabledDay));
      const isBeforeMinimumDate = isStandard && isBeforeDate(dayItem, minimumDate);
      const isAfterMaximumDate = isStandard && isBeforeDate(maximumDate, dayItem);
      const isDisabled = isInDisabledDaysRange || isBeforeMinimumDate || isAfterMaximumDate;
      const isWeekend =
        isStandard &&
        weekDaysList.some(
          (weekDayItem, weekDayItemIndex) =>
            weekDayItem.isWeekend && weekDayItemIndex === columnIndex,
        );
      const customDayItemClassName = customDaysClassName.find((day) => isSameDay(dayItem, day));
      const status = isStandard ? getDayStatus(dayItem) : {};
      const dayLabel = isStandard
        ? `${weekDaysList[columnIndex].name}, ${cell.value} ${getMonthName(activeDate.month)} ${
            activeDate.year
          }`
        : '';

      return {
        id: cell.id,
        day: cell.value,
        month: cell.month,
        year: cell.year,
        isStandard,
        isDisabled,
        isWeekend: Boolean(isWeekend && shouldHighlightWeekends),
        label: isStandard ? getLanguageDigits(cell.value) : '',
        ariaLabel: dayLabel,
        customClassName: customDayItemClassName ? customDayItemClassName.className : '',
        ...status,
      };
    });
    weeks.push(row);
  }

  return weeks;
}

export function createCalendar(userOptions = {}) {
  const options = { ...defaultOptions, ...userOptions };
  let value = options.value;
  let activeDate = null;
  let isMonthSelectorOpen = false;
  let isYearSelectorOpen = false;
  let monthChangeDirection = '';
  const listeners = new Set();

  const notify = () => {
    listeners.forEach((listener) => listener(getSnapshot()));
  };

  const localeApi = localeUtils(options.locale);
  const localeLanguage =
    typeof options.locale === 'string' ? getLocaleDetails(options.locale) : options.locale;
  const { getToday, getMonthName, getMonthNumber, isBeforeDate, getLanguageDigits } = localeApi;

  const ensureActiveDate = () => {
    if (!activeDate) {
      activeDate = getComputedActiveDate(value, getToday);
    }
  };

  const setValue = (nextValue) => {
    value = nextValue;
    options.onChange(value);
    notify();
  };

  const getSnapshot = () => {
    ensureActiveDate();
    const {
      months: monthsList,
      weekDays: weekDaysList,
      isRtl,
      nextMonth,
      previousMonth,
      openMonthSelector,
      closeMonthSelector,
      openYearSelector,
      closeYearSelector,
    } = localeLanguage;

    const isNextMonthArrowDisabled =
      options.maximumDate &&
      isBeforeDate(options.maximumDate, {
        ...activeDate,
        month: activeDate.month + 1,
        day: 1,
      });
    const isPreviousMonthArrowDisabled =
      options.minimumDate &&
      (isBeforeDate({ ...activeDate, day: 1 }, options.minimumDate) ||
        isSameDay(options.minimumDate, { ...activeDate, day: 1 }));

    const months = monthsList.map((monthName) => {
      const monthNumber = getMonthNumber(monthName);
      const monthDate = { day: 1, month: monthNumber, year: activeDate.year };
      const isAfterMaximumDate =
        options.maximumDate &&
        isBeforeDate(options.maximumDate, { ...monthDate, month: monthNumber });
      const isBeforeMinimumDate =
        options.minimumDate &&
        (isBeforeDate({ ...monthDate, month: monthNumber + 1 }, options.minimumDate) ||
          isSameDay({ ...monthDate, month: monthNumber + 1 }, options.minimumDate));
      return {
        name: monthName,
        number: monthNumber,
        disabled: isAfterMaximumDate || isBeforeMinimumDate,
        selected: monthNumber === activeDate.month,
      };
    });

    const startingYearValue =
      options.selectorStartingYear || getToday().year - MINIMUM_SELECTABLE_YEAR_SUBTRACT;
    const endingYearValue =
      options.selectorEndingYear || getToday().year + MAXIMUM_SELECTABLE_YEAR_SUM;
    const years = [];
    for (let year = startingYearValue; year <= endingYearValue; year += 1) {
      const isAfterMaximumDate = options.maximumDate && year > options.maximumDate.year;
      const isBeforeMinimumDate = options.minimumDate && year < options.minimumDate.year;
      years.push({
        value: year,
        label: getLanguageDigits(year),
        disabled: isAfterMaximumDate || isBeforeMinimumDate,
        selected: activeDate.year === year,
      });
    }

    const slideViewDate = monthChangeDirection
      ? getDateAccordingToMonth(activeDate, monthChangeDirection === 'NEXT' ? 'PREVIOUS' : 'NEXT')
      : getDateAccordingToMonth(activeDate, 'NEXT');

    return {
      locale: options.locale,
      value,
      activeDate: shallowClone(activeDate),
      isMonthSelectorOpen,
      isYearSelectorOpen,
      isRtl,
      weekDays: weekDaysList,
      weeks: buildMonthDays(activeDate, { ...options, value }, localeApi, weekDaysList),
      slideWeeks: buildMonthDays(slideViewDate, { ...options, value }, localeApi, weekDaysList),
      months,
      years,
      header: {
        monthLabel: getMonthName(activeDate.month),
        yearLabel: getLanguageDigits(activeDate.year),
        previousDisabled: Boolean(isPreviousMonthArrowDisabled),
        nextDisabled: Boolean(isNextMonthArrowDisabled),
      },
      labels: {
        nextMonth,
        previousMonth,
        openMonthSelector,
        closeMonthSelector,
        openYearSelector,
        closeYearSelector,
      },
      monthChangeDirection,
    };
  };

  const api = {
    subscribe(listener) {
      listeners.add(listener);
      listener(getSnapshot());
      return () => listeners.delete(listener);
    },
    getSnapshot,
    getValue: () => value,
    setValue,
    selectDay(day) {
      ensureActiveDate();
      const dayItem = { day: day.day, month: day.month, year: day.year };
      const isInDisabledDaysRange = options.disabledDays.some((disabledDay) =>
        isSameDay(dayItem, disabledDay),
      );
      const isBeforeMinimumDate = isBeforeDate(dayItem, options.minimumDate);
      const isAfterMaximumDate = isBeforeDate(options.maximumDate, dayItem);
      const isDisabled = isInDisabledDaysRange || isBeforeMinimumDate || isAfterMaximumDate;
      if (isDisabled) {
        options.onDisabledDayError(dayItem);
        return;
      }
      setValue(
        resolveNewValue(
          dayItem,
          value,
          options.disabledDays,
          options.locale,
          options.onDisabledDayError,
        ),
      );
    },
    goToMonth(direction) {
      if (isMonthSelectorOpen || isYearSelectorOpen) return;
      if (monthChangeDirection) return;
      ensureActiveDate();
      monthChangeDirection = direction;
      activeDate = getDateAccordingToMonth(activeDate, direction);
      notify();
    },
    completeMonthTransition() {
      if (!monthChangeDirection) return;
      monthChangeDirection = '';
      notify();
    },
    toggleMonthSelector() {
      isMonthSelectorOpen = !isMonthSelectorOpen;
      if (isMonthSelectorOpen) isYearSelectorOpen = false;
      notify();
    },
    toggleYearSelector() {
      isYearSelectorOpen = !isYearSelectorOpen;
      if (isYearSelectorOpen) isMonthSelectorOpen = false;
      notify();
    },
    selectMonth(monthNumber) {
      ensureActiveDate();
      monthChangeDirection = '';
      activeDate = { ...activeDate, month: monthNumber };
      isMonthSelectorOpen = false;
      notify();
    },
    selectYear(year) {
      ensureActiveDate();
      monthChangeDirection = '';
      activeDate = { ...activeDate, year };
      isYearSelectorOpen = false;
      notify();
    },
    setActiveDate(date) {
      activeDate = shallowClone(date);
      notify();
    },
    destroy() {
      listeners.clear();
    },
  };

  return api;
}

export default createCalendar;
