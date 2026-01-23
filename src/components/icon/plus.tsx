// <!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
import { h } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";
import type { IconProps } from "./icon.tsx";

export function IconPlus({ className, ...props }: Omit<IconProps, "icon">) {
  return (
    <svg
      className={classNames("component-icon", "component-icon-plus", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      {...props}
    >
      <path
        d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"
        fill="inherit"
      />
    </svg>
  );
}
