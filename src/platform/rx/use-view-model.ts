import { useEffect, useMemo, useReducer } from "preact/hooks";
import { subscribe, ViewModelLifecycle } from "./subscribe.ts";

export function useViewModel<
  T extends EventTarget & ViewModelLifecycle,
  U extends Array<any>,
>(ctor: new (...args: U) => T, args: U): T {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  const instance = useMemo(() => new ctor(...args), [ctor, ...args]);

  useEffect(() => {
    const onChange = () => forceUpdate();
    return subscribe(instance, onChange);
  }, [instance]);

  return instance;
}

export function useReactive<T extends EventTarget & ViewModelLifecycle>(
  instance: T,
): T {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  useEffect(() => {
    const onChange = () => forceUpdate();
    return subscribe(instance, onChange);
  }, [instance]);

  return instance;
}
