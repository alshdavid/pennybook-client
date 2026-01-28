import { Callback, noop } from "./observable.ts";
import { Subject } from "./subject.ts";

export interface ValueGetter<T> {
  getValue(): T;
}

export class BehaviorSubject<T = any>
  extends Subject<T>
  implements ValueGetter<T>
{
  #lastValue: T;

  constructor(initialValue: T) {
    super();
    this.#lastValue = initialValue;
  }

  subscribe(
    callback: Callback<[T]> = noop,
    error: Callback<[T]> = noop,
    complete: Callback<[]> = noop,
  ) {
    callback(this.#lastValue);
    return super.subscribe(callback, error, complete);
  }

  next(value: T) {
    this.#lastValue = value;
    return super.next(value);
  }

  getValue(): T {
    return this.#lastValue;
  }
}
