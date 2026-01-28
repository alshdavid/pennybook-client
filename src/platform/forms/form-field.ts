import { BehaviorSubject } from "../rxjs/index.ts";

export class FormField<T> extends BehaviorSubject<T> {
  get value(): T {
    return this.getValue();
  }

  set value(update: T) {
    this.update(update);
  }

  asProps() {
    return { onInput: this.fromEvent, value: this.getValue() };
  }

  fromEvent = (event: Event) => {
    this.update(
      // @ts-expect-error
      event?.target?.value,
    );
  };

  update = (value: T) => {
    this.next(value);
  };

  constructor(initialValue: T) {
    super(initialValue);
  }
}
