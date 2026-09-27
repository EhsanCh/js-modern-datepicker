import getLocaleDetails from '../shared/localeLanguages';
import { getValueType } from '../shared/generalUtils';
import { TYPE_RANGE, TYPE_SINGLE_DATE } from '../shared/constants';
import { createDatePicker } from './mountDatePicker';
import { formatDatePickerInput } from './formatInputValue';

function resolveInput(input) {
  if (!input) return null;
  if (typeof input === 'string') return document.querySelector(input);
  return input;
}

function shouldCloseOnChange(value) {
  const valueType = getValueType(value);
  if (valueType === TYPE_SINGLE_DATE) return Boolean(value);
  if (valueType === TYPE_RANGE) return Boolean(value?.from && value?.to);
  return false;
}

function positionCalendar(container, inputEl, calendarPopperPosition) {
  container.classList.remove('-top');
  if (calendarPopperPosition === 'top') {
    container.classList.add('-top');
    return;
  }
  if (calendarPopperPosition === 'bottom') return;

  const inputRect = inputEl.getBoundingClientRect();
  const calendarHeight = container.offsetHeight || 400;
  const spaceBelow = window.innerHeight - inputRect.bottom;
  if (spaceBelow < calendarHeight && inputRect.top > calendarHeight) {
    container.classList.add('-top');
  }
}

export function createInputDatePicker(options = {}) {
  const {
    input,
    wrapper: wrapperOption,
    calendarPopperPosition = 'auto',
    wrapperClassName = '',
    inputClassName = '',
    inputPlaceholder,
    inputName,
    formatInputText,
    closeOnSelect,
    onOpen,
    onClose,
    onChange: userOnChange,
    locale = 'en',
    ...pickerOptions
  } = options;

  const inputEl = resolveInput(input);
  if (!inputEl || !(inputEl instanceof HTMLInputElement)) {
    throw new TypeError('createInputDatePicker requires an `input` element (or selector).');
  }

  const localeDetails = getLocaleDetails(locale);
  const rtlClass = localeDetails.isRtl ? '-rtl' : '-ltr';

  let wrapperEl = wrapperOption;
  let createdWrapper = false;
  if (!wrapperEl) {
    wrapperEl = document.createElement('div');
    wrapperEl.className = `DatePicker ${rtlClass} ${wrapperClassName}`.trim();
    const parent = inputEl.parentNode;
    if (parent) {
      parent.insertBefore(wrapperEl, inputEl);
      wrapperEl.appendChild(inputEl);
      createdWrapper = true;
    }
  } else {
    wrapperEl.classList.add('DatePicker', rtlClass);
    if (wrapperClassName) wrapperEl.classList.add(wrapperClassName);
  }

  inputEl.readOnly = true;
  inputEl.classList.add('DatePicker__input', rtlClass);
  if (inputClassName) inputEl.classList.add(inputClassName);
  if (inputName) inputEl.name = inputName;
  inputEl.placeholder =
    inputPlaceholder !== undefined ? inputPlaceholder : localeDetails.defaultPlaceholder;
  inputEl.setAttribute('autocomplete', 'off');

  const container = document.createElement('div');
  container.className = 'DatePicker__calendarContainer';
  container.hidden = true;
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-modal', 'true');
  wrapperEl.appendChild(container);

  let isOpen = false;
  let ignoreNextOutside = false;

  const syncInput = (value) => {
    inputEl.value = formatDatePickerInput(value, locale, formatInputText);
  };

  const setOpen = (open) => {
    if (isOpen === open) return;
    isOpen = open;
    container.hidden = !open;
    inputEl.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      requestAnimationFrame(() => positionCalendar(container, inputEl, calendarPopperPosition));
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const initialValue = pickerOptions.value !== undefined ? pickerOptions.value : null;
  syncInput(initialValue);

  const picker = createDatePicker({
    locale,
    ...pickerOptions,
    element: container,
    onChange: (value) => {
      userOnChange?.(value);
      syncInput(value);
      const close = closeOnSelect !== undefined ? closeOnSelect : shouldCloseOnChange(value);
      if (close) {
        setOpen(false);
        inputEl.focus();
      }
    },
  });

  const openCalendar = () => {
    ignoreNextOutside = true;
    setOpen(true);
  };

  inputEl.addEventListener('click', (event) => {
    event.stopPropagation();
    if (isOpen) return;
    openCalendar();
  });

  inputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(!isOpen);
    }
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setOpen(false);
    }
  });

  const onDocumentPointerDown = (event) => {
    if (!isOpen) return;
    if (ignoreNextOutside) {
      ignoreNextOutside = false;
      return;
    }
    if (wrapperEl.contains(event.target)) return;
    setOpen(false);
  };

  const onWindowBlur = () => setOpen(false);

  document.addEventListener('pointerdown', onDocumentPointerDown);
  window.addEventListener('blur', onWindowBlur);

  const destroy = () => {
    document.removeEventListener('pointerdown', onDocumentPointerDown);
    window.removeEventListener('blur', onWindowBlur);
    picker.destroy();
    container.remove();
    if (createdWrapper) {
      const parent = wrapperEl.parentNode;
      if (parent) parent.insertBefore(inputEl, wrapperEl);
      wrapperEl.remove();
    }
    inputEl.classList.remove('DatePicker__input', '-rtl', '-ltr');
  };

  return {
    calendar: picker.calendar,
    input: inputEl,
    wrapper: wrapperEl,
    open: () => setOpen(true),
    close: () => setOpen(false),
    destroy,
    render: picker.render,
  };
}
