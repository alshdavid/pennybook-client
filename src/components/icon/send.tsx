import { h } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";
import type { IconProps } from "./icon.tsx";

export function IconSend({ className, ...props }: Omit<IconProps, "icon">) {
  return (
    <svg
      className={classNames("component-icon", "component-icon-send", className)}
      viewBox="0 0 576 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="inherit"
        d="M0.25672 48.3865L0.327427 214.184L224.364 253.094L0.327432 299.684L0.327423 457.731C0.327433 476.184 -2.21817 485.874 7.82273 495.914C18.2172 506.309 33.9857 509.067 47.35 502.773L524.506 277.348C533.91 272.893 539.779 263.488 539.85 253.094C539.921 242.699 533.91 233.295 524.506 228.84L47.2793 3.34382C33.915 -2.94942 18.1465 -0.191716 7.75205 10.2028C-2.28886 20.2437 0.327427 34.6836 0.25672 48.3865Z"
      />
    </svg>
  );
}
