import { h } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";
import type { IconProps } from "./icon.tsx";

export function IconSidebar({ className, ...props }: Omit<IconProps, "icon">) {
  return (
    <svg
      className={classNames("component-icon", "component-icon-plus", className)}
      {...props}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="transparent"
      style={{ fill: "transparent", opacity: "0.7" }}
    >
      <rect
        x="4.5"
        y="4.5"
        width="91"
        height="91"
        rx="19.5"
        stroke="white"
        stroke-width="9"
      />
      <line
        x1="31.5"
        y1="5"
        x2="31.5"
        y2="95"
        stroke="white"
        stroke-width="9"
      />
    </svg>
  );
}
