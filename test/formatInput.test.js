import { formatDatePickerInput } from '../src/vanilla/formatInputValue';

describe('formatDatePickerInput', () => {
  test('formats single gregorian date', () => {
    expect(formatDatePickerInput({ year: 2026, month: 9, day: 5 }, 'en')).toBe('2026/09/05');
  });

  test('formats range when complete', () => {
    const value = {
      from: { year: 2026, month: 1, day: 1 },
      to: { year: 2026, month: 1, day: 10 },
    };
    expect(formatDatePickerInput(value, 'en')).toBe('from 2026/01/01 to 2026/01/10');
  });
});
