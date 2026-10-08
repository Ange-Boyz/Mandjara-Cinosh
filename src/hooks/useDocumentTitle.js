import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Mandjara Cinosh` : 'Mandjara Cinosh — The culture that feeds the Soul';
  }, [title]);
}
