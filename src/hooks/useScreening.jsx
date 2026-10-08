import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { ApiError } from '../services/http.js';

// The "next screening" is the single most important piece of data on the site:
// one provider, one fetch, shared by every page. The server is the source of
// truth for seats remaining, price and status.
const ScreeningContext = createContext(null);

export function ScreeningProvider({ children }) {
  const [state, setState] = useState({ phase: 'loading', screening: null, error: null });

  const load = useCallback(async (signal) => {
    try {
      const screening = await api.getNextScreening(signal);
      if (signal?.aborted) return;
      setState({ phase: 'ready', screening, error: null });
    } catch (err) {
      if (signal?.aborted || err?.name === 'AbortError') return;
      if (err instanceof ApiError && err.status === 404) {
        setState({ phase: 'none', screening: null, error: null });
      } else {
        // Keep showing the last good data if a background refresh fails.
        setState((s) => (s.screening ? s : { phase: 'error', screening: null, error: err }));
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    // Seats sell while the tab is open: refresh when the visitor comes back.
    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      controller.abort();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  const reload = useCallback(() => {
    setState((s) => (s.screening ? s : { phase: 'loading', screening: null, error: null }));
    return load();
  }, [load]);

  const value = useMemo(() => ({ ...state, reload }), [state, reload]);
  return <ScreeningContext.Provider value={value}>{children}</ScreeningContext.Provider>;
}

export function useScreening() {
  const ctx = useContext(ScreeningContext);
  if (!ctx) throw new Error('useScreening must be used inside <ScreeningProvider>');
  return ctx;
}
