import { type Observable } from "rxjs";
import { useEffect, useRef, useState } from "preact/hooks";

export function useAsync<T>(x: Observable<T>, defaultValue: T): T {
  const [v, setV] = useState<T>(defaultValue);

  useEffect(() => {
    const s = x.subscribe(setV);
    return () => s.unsubscribe();
  }, [x]);

  return v;
}

export function usePromise<T>(
  promiseFn: () => Promise<T>,
  defaultValue: T,
  deps: any[] = [],
): T {
  const [value, setValue] = useState<T>(defaultValue);
  const promiseRef = useRef(promiseFn);

  // Keep the ref up to date
  useEffect(() => {
    promiseRef.current = promiseFn;
  }, [promiseFn]);

  useEffect(() => {
    let isMounted = true;

    const execute = async () => {
      try {
        const result = await promiseRef.current();
        if (isMounted) {
          setValue(result);
        }
      } catch (error) {
        console.error("usePromise Error:", error);
      }
    };

    execute();
    return () => {
      isMounted = false;
    };
  }, deps);

  return value;
}
