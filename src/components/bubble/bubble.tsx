import "./bubble.scss";
import { h, type HTMLAttributes } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";

export type BubbleProps = HTMLAttributes<HTMLDivElement> & {};

export function Bubble({ className, ...props }: BubbleProps) {
  return (
    <div {...props} className={classNames("component-bubble", className)} />
  );
}
