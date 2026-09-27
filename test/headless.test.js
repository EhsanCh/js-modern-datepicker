import { createCalendar } from '../src/headless/createCalendar';

describe('createCalendar (headless)', () => {
  test('exposes month grid and selects a single day', () => {
    const onChange = jest.fn();
    const calendar = createCalendar({
      locale: 'en',
      value: null,
      onChange,
    });

    const snapshot = calendar.getSnapshot();
    expect(snapshot.weeks).toHaveLength(6);
    expect(snapshot.weekDays).toHaveLength(7);

    const firstSelectable = snapshot.weeks.flat().find((day) => day.isStandard && !day.isDisabled);
    expect(firstSelectable).toBeTruthy();

    calendar.selectDay(firstSelectable);
    expect(onChange).toHaveBeenCalledWith({
      year: firstSelectable.year,
      month: firstSelectable.month,
      day: firstSelectable.day,
    });
  });

  test('navigates months', () => {
    const calendar = createCalendar({
      locale: 'en',
      value: { year: 2020, month: 6, day: 15 },
    });
    const before = calendar.getSnapshot().activeDate.month;
    calendar.goToMonth('NEXT');
    expect(calendar.getSnapshot().activeDate.month).toBe(before === 12 ? 1 : before + 1);
    expect(calendar.getSnapshot().monthChangeDirection).toBe('NEXT');
    calendar.completeMonthTransition();
    expect(calendar.getSnapshot().monthChangeDirection).toBe('');
  });
});
