// <!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
import { h } from "preact";
import type { IconProps } from "./icon.tsx";
import { classNames } from "../../platform/preact/class-names.ts";

export function IconChevronDown({
  className,
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <svg
      className={classNames(
        "component-icon",
        "component-icon-chevron-down",
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      viewBox="0 0 448 512"
    >
      <path
        d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
        fill="inherit"
      />
    </svg>
  );
}
