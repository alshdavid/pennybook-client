import { useEffect, useMemo, useState } from "preact/hooks"

export const ReactiveSymbol = Symbol('ReactiveSymbol')

export type ReactiveCallback = (value?: unknown) => any | Promise<any>
export type ReactiveCloseCallback = () => any | Promise<any>
export type ReactiveUnsubscriber = () => void

export type ChangeType = typeof ChangeType[keyof typeof ChangeType];
export const ChangeType = Object.freeze({
  /** @description Trigger an update notification if the value is reassigned */
  Push: Symbol('push'),
  /** @description Trigger an update notification if the value is reassigned or mutated */
  Proxy: Symbol('proxy'),
})

export interface OnInit {
  onInit?(): any | Promise<any>
}

export interface OnDestroy {
  onDestroy?(): any | Promise<any>
}

export class ViewModel {
  #listeners: Set<ReactiveCallback> = new Set();
  #closed: Set<ReactiveCallback> = new Set();
  [ReactiveSymbol]: Record<any, any> = {}

  subscribe(callback: ReactiveCallback, closeCallback?: ReactiveCloseCallback): ReactiveUnsubscriber {
    this.#listeners.add(callback)
    if (closeCallback) this.#closed.add(closeCallback)
    return () => {
      this.#listeners.delete(callback)
      if (closeCallback) this.#closed.add(closeCallback)
    }
  }

  next(data?: any) {
    for (const callback of this.#listeners.values()) setTimeout(callback, 0, data)
  }

  close() {
    for (const callback of this.#closed.values()) setTimeout(callback, 0)
    this.#closed.clear()
    this.#listeners.clear()
  }
}

export function useViewModel<T extends ViewModel & OnInit & OnDestroy, A extends Array<any>>(ctor: new (...args: A) => T, args?: A): T {
  const [, setState] = useState({})

  const target = useMemo(() => {
    const instance = new ctor(...(args || []) as any)
    instance.onInit?.()
    setState(instance[ReactiveSymbol])
    return instance
  }, [ctor])

  useEffect(() => {
    const dispose = target.subscribe(() => setState(structuredClone(target[ReactiveSymbol])))
    return () => {
      target.onDestroy?.()
      dispose()
    }
  }, [target])

  return target
}

export function observeProperty<T extends ViewModel>(self: T, key: keyof T, changeType: ChangeType) {
  if (changeType === ChangeType.Push) {
    self[ReactiveSymbol][key] = self[key]
  }
  else if (changeType === ChangeType.Proxy) {
    self[ReactiveSymbol][key] = buildProxy(self[key], () => self.next())
  }
  else {
    throw new Error("Unknown ChangeDetection Method")
  }

  Object.defineProperty(self, key, {
    get: () => {
      return self[ReactiveSymbol][key]
    },
    set: (value: any) => {
      if (value !== self[ReactiveSymbol][key]) {
        self[ReactiveSymbol][key] = value
        self.next()
      }
    }
  })
}

export function observeProperties<T extends ViewModel, K extends keyof T>(self: T, keys: { [U in K]: ChangeType }) {
  for (const [key, changeType] of Object.entries(keys)) {
    observeProperty(self, key as any, changeType as any)
  }
}


function buildProxy(poj: any, callback: any, tree: any = []) {
  return new Proxy(poj, {
    get: (target, prop)  =>{
      const value = Reflect.get(target, prop);

      if (
        value &&
        typeof value === "object" &&
        ["Array", "Object"].includes(value.constructor.name)
      )
        return buildProxy(value, callback, tree.concat(prop));

      return value;
    },

    set: (target, prop, value) => {
      callback(tree.concat(prop));
      return Reflect.set(target, prop, value);
    },

    deleteProperty: (target, prop) => {
      callback(tree.concat(prop));
      return Reflect.deleteProperty(target, prop);
    },
  });
}
