import "./button.scss";
import { h, type ButtonHTMLAttributes } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: "basic" | "green" | "red" | "blue";
};

export function Button({ theme, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames("component-button", className, theme)}
    />
  );
}
