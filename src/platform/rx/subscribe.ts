import { Observable, Subscription } from "../rxjs/index.ts";
import { getOrInit, ON_CHANGE } from "./symbol.ts";

export function subscribe(
  target: any,
  callback: () => any | Promise<any>,
): Subscription {
  const [subject, stash] = getOrInit(target);
  const subscription = subject.subscribe(callback);

  for (const value of Object.values(stash) || []) {
    if (value instanceof Observable) {
      subscription.add(value.subscribe(callback));
      continue;
    }

    if (typeof value === "object" && ON_CHANGE in value) {
      subscription.add(subscribe(value, callback));
    }
  }

  return subscription;
}

export function asObservable(target: any): Observable<void> {
  if (typeof target === "object" && ON_CHANGE in target) {
    return target[ON_CHANGE][0];
  }
  throw new Error("Not reactive");
}
