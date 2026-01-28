import { Observable } from "../rxjs/index.ts";
import { Operation } from "./operation.ts";
import { PipeFunc } from "./pipe-func.ts";

export const pipe: PipeFunc =
  (target$) =>
  (...ops: any) => {
    return new Observable<any>((observer) => {
      const sub = target$.subscribe(
        async (value) => {
          try {
            let state: Operation<any> = new Operation(value);
            for (const op of ops) {
              state = op(state);

              if (state.value instanceof Promise) {
                state.value = await state.value;
              }

              if (state.skip === true || state.complete === true) {
                break;
              }
            }
            if (state.skip) {
              return;
            }
            observer.next(state.value);
            if (state.complete === true) {
              observer.complete();
            }
          } catch (error) {
            observer.error(error);
          }
        },
        (error) => observer.error(error),
        () => observer.complete(),
      );
      return () => sub.unsubscribe();
    });
  };
