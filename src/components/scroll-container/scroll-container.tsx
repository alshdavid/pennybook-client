/*
  This is crazy hacky... but it works?
*/
import "./scroll-container.scss";
import { h, type VNode, type HTMLAttributes } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";

export type ScrollContainerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: Array<VNode>;
};

export function ScrollContainer({
  className,
  children,
  ...props
}: ScrollContainerProps) {
  return (
    <div
      className={classNames("component-scroll-container", className)}
      children={[...children].reverse()}
      {...props}
    />
  );
}
