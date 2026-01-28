import { ON_CHANGE } from "./symbol.ts";

export function notifyChange(self: any) {
  if (ON_CHANGE in self) {
    self[ON_CHANGE][0].next();
  }
}
