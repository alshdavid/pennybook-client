// <!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
import { h } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";
import type { IconProps } from "./icon.tsx";

export function IconEllipsis({ className, ...props }: Omit<IconProps, "icon">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(
        "component-icon",
        "component-icon-ellipsis-vertical",
        className,
      )}
      viewBox="0 0 448 512"
      {...props}
    >
      <path
        d="M0 256a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm168 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm224-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"
        fill="inherit"
      />
    </svg>
  );
}
