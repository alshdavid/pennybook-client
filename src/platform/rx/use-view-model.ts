import { useEffect, useMemo, useReducer, useState } from "preact/hooks";
import { subscribe } from "./subscribe.ts";
import { Observable } from "../rxjs/index.ts";

export interface ViewModelLifecycle {
  onInit?(): any | Promise<any>;
  onDestroy?(): any | Promise<any>;
}

export function useViewModel<
  T extends ViewModelLifecycle & Object,
  U extends Array<any>,
>(ctor: new (...args: U) => T, args: U): T {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  const instance = useMemo(() => new ctor(...args), [ctor, ...args]);

  useEffect(() => {
    const onChange = () => forceUpdate();
    const subscription = subscribe(instance, onChange);
    instance.onInit?.();
    return () => {
      instance.onDestroy?.();
      subscription.unsubscribe();
    };
  }, [instance]);

  return instance;
}

export function useReactive<T>(instance: T): T {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  useEffect(() => {
    const onChange = () => forceUpdate();
    const subscription = subscribe(instance, onChange);
    return () => {
      subscription.unsubscribe();
    };
  }, [instance]);

  return instance;
}

export function useAsync<T>(x: Observable<T>, defaultValue: T): T {
  const [v, setV] = useState<T>(defaultValue);

  useEffect(() => {
    const s = x.subscribe(setV);
    return () => s.unsubscribe();
  }, [x]);

  return v;
}
