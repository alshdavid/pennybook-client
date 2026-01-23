import "./content-editable.scss";
import { useEffect, useState } from "preact/hooks";
import { h, RefObject, type TextareaHTMLAttributes } from "preact";
import { HTMLContentEditable } from "../../custom-elements/app-contenteditable/app-contenteditable.ts";
import { classNames } from "../../platform/preact/class-names.ts";

export type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "ref"
> & {
  inner?:
    | ((element: HTMLContentEditable) => any)
    | RefObject<HTMLContentEditable>;
  onSubmit?: (e: Event) => void;
};

HTMLContentEditable.register();

export function ContentEditable({
  inner,
  onSubmit,
  className,
  ...props
}: TextareaProps) {
  const [elmRef, setElmRef] = useState<HTMLContentEditable | null>(null);

  useEffect(() => {
    if (!inner) return;
    if (!elmRef) return;
    if (typeof inner === "function") {
      inner(elmRef);
    } else {
      inner.current = elmRef;
    }
  }, [elmRef]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      onSubmit?.(e);
    }
  };

  return (
    // @ts-expect-error
    <app-contenteditable
      className={classNames("component-content-editable", className)}
      onKeyDown={handleKeyDown}
      ref={setElmRef}
      {...props}
    />
  );
}
