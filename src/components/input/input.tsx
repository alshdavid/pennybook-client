import "./input.scss";
import { h, type InputHTMLAttributes } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  onEnter?: (ev: KeyboardEvent) => any | Promise<any>;
};

export function Input({ className, onEnter, ...props }: InputProps) {
  return (
    <input {...props} className={classNames("component-input", className)} />
  );
}
