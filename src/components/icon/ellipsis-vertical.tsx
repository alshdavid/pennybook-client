// <!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
import { h } from "preact";
import type { IconProps } from "./icon.tsx";
import { classNames } from "../../platform/preact/class-names.ts";

export function IconEllipsisVertical({
  className,
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <svg
      className={classNames(
        "component-icon",
        "component-icon-ellipsis-vertical",
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 512"
      {...props}
    >
      <path
        d="M64 144a56 56 0 1 1 0-112 56 56 0 1 1 0 112zm0 224c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm56-112c0 30.9-25.1 56-56 56s-56-25.1-56-56 25.1-56 56-56 56 25.1 56 56z"
        fill="inherit"
      />
    </svg>
  );
}
