import { Subject } from "../rxjs/index.ts";

export const ON_CHANGE = Symbol("ON_CHANGE");

export type RxState = [Subject<void>, Record<any, any>];

export function getOrInit(self: any): RxState {
  if (!self[ON_CHANGE]) {
    Object.defineProperty(self, ON_CHANGE, {
      value: [new Subject<void>(), {}],
      configurable: false,
      writable: false,
      enumerable: false,
    });
  }
  return self[ON_CHANGE] as any;
}
