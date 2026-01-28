import { Subscriber, Observable, SubscriberValue } from "./observable.ts";
import { Subscription } from "./subscription.ts";

export const merge = <T extends Array<Subscriber<any>>>(
  ...sources: T
): Observable<SubscriberValue<T[number]>> =>
  new Observable((observer) => {
    const subscription = new Subscription();
    let totalComplete = 0;
    const observe = () => [
      (v: any) => observer.next(v),
      (e: any) => observer.error(e),
      () => {
        totalComplete += 1;
        if (totalComplete >= sources.length) {
          observer.complete();
        }
      },
    ];
    for (const source of sources) {
      subscription.add(source.subscribe(...observe()));
    }
    return () => subscription.unsubscribe();
  });
