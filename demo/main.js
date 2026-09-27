import { createDatePicker } from '../src/vanilla/index.js';

function mount(id, outId, options) {
  const pre = document.getElementById(outId);
  createDatePicker({
    element: document.getElementById(id),
    locale: 'en',
    ui: 'classic',
    shouldHighlightWeekends: true,
    ...options,
    onChange: (value) => {
      pre.textContent = JSON.stringify(value, null, 2);
    },
  });
}

mount('cal-single', 'out-single', { value: null });

mount('cal-range', 'out-range', { value: { from: null, to: null } });

mount('cal-multi', 'out-multi', { value: [] });

mount('cal-fa', 'out-fa', {
  locale: 'fa',
  value: { year: 1404, month: 7, day: 1 },
});
