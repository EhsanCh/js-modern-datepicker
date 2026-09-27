import { TYPE_MUTLI_DATE, TYPE_RANGE, TYPE_SINGLE_DATE } from '../shared/constants';
import getLocaleDetails from '../shared/localeLanguages';
import { putZero, getValueType } from '../shared/generalUtils';
import utils from '../shared/localeUtils';

export function formatDatePickerInput(value, locale = 'en', formatInputText) {
  if (typeof formatInputText === 'function') {
    const custom = formatInputText(value);
    if (custom) return custom;
  }

  const localeDetails = getLocaleDetails(locale);
  const { getLanguageDigits } = utils(locale);
  const { from, to, digitSeparator, yearLetterSkip } = localeDetails;

  const valueType = getValueType(value);

  if (valueType === TYPE_SINGLE_DATE) {
    if (!value) return '';
    const year = getLanguageDigits(value.year);
    const month = getLanguageDigits(putZero(value.month));
    const day = getLanguageDigits(putZero(value.day));
    return `${year}/${month}/${day}`;
  }

  if (valueType === TYPE_RANGE) {
    if (!value?.from || !value?.to) return '';
    const formatPart = (part) => {
      const y = getLanguageDigits(putZero(part.year)).toString().slice(yearLetterSkip);
      const m = getLanguageDigits(putZero(part.month));
      const d = getLanguageDigits(putZero(part.day));
      return `${y}/${m}/${d}`;
    };
    return `${from} ${formatPart(value.from)} ${to} ${formatPart(value.to)}`;
  }

  if (valueType === TYPE_MUTLI_DATE) {
    if (!value?.length) return '';
    return value.map((item) => getLanguageDigits(item.day)).join(`${digitSeparator} `);
  }

  return '';
}
