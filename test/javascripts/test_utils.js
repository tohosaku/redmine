export function createPointerEvent(name, option = {}) {
  const ua = navigator.userAgentData;
  let param = option
  if (typeof ua !== 'undefined' && ua.brands.some(i => i.brand === 'Chromium')) {
    param = { ...param, pointerId: 1, isPrimary: true }
  }

  return new PointerEvent(name, param);
}
