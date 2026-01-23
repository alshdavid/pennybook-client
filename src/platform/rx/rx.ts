import { ON_CHANGE } from "./symbol.ts";

/**
 * @description This decorator dispatches a notification when a property is replaced
 */
export function rx<T extends EventTarget, V>(
  _target: ClassAccessorDecoratorTarget<T, V>,
  context: ClassAccessorDecoratorContext<T, V>,
) {
  const propertyKey = context.name as string;

  return {
    get(this: T): V {
      if (!(this as any)[ON_CHANGE]) {
        (this as any)[ON_CHANGE] = {};
      }
      return (this as any)[ON_CHANGE][propertyKey];
    },
    set(this: T, value: V) {
      if (!(this as any)[ON_CHANGE]) {
        (this as any)[ON_CHANGE] = {};
      }

      const oldValue = (this as any)[ON_CHANGE][propertyKey];

      if (oldValue === value) return;

      (this as any)[ON_CHANGE][propertyKey] = value;

      this.dispatchEvent(
        new CustomEvent("change", {
          detail: propertyKey,
        }),
      );
    },
    init(this: T, initialValue: V): V {
      if (!(this as any)[ON_CHANGE]) {
        (this as any)[ON_CHANGE] = {};
      }
      (this as any)[ON_CHANGE][propertyKey] = initialValue;
      return initialValue;
    },
  };
}
