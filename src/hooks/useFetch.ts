import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../services/api";

/** Small data-loading hook for admin screens that do not need global Redux state. */
export const useFetch = <T,>(fetcher: () => Promise<T>, deps: unknown[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setData(await fetcherRef.current()); }
    catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load(); }, [load, ...deps]);
  return { data, loading, error, reload: load, setData };
};
