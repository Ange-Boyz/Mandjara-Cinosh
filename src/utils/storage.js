// Storage can throw (private mode, blocked cookies). Never let that break the UI.
const wrap = (store) => ({
  get(key) {
    try {
      return window[store].getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window[store].setItem(key, value);
    } catch {
      /* ignore */
    }
  },
});

export const session = wrap('sessionStorage');
export const local = wrap('localStorage');
