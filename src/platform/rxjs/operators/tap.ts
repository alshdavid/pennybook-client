import { OperatorFunc, CallbackFunc } from "./operation.ts";

export const tap =
  <T>(cb: CallbackFunc<T>): OperatorFunc<T, T> =>
  (op) => {
    cb(op.value);
    return op;
  };
