import "./select.scss";
import { h, type SelectHTMLAttributes } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {};

export function Select({ className, ...props }: SelectProps) {
  return (
    <select {...props} className={classNames("component-select", className)} />
  );
}
