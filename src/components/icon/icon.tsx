import "./icon.scss";
import { h } from "preact";
import type { SVGAttributes } from "preact";
import { IconSend } from "./send.tsx";
import { IconEllipsis } from "./ellipsis.tsx";
import { IconEllipsisVertical } from "./ellipsis-vertical.tsx";
import { IconPlus } from "./plus.tsx";
import { IconBars } from "./bars.tsx";
import { IconPenToSquare } from "./pen-to-square.tsx";
import { IconBrand } from "./brand.tsx";
import { IconChevronDown } from "./chevron-down.tsx";
import { IconGear } from "./gear.tsx";
import { IconCircle } from "./circle.tsx";
import { IconBrandHollow } from "./brand-hollow.tsx";
import { IconSidebar } from "./sidebar.tsx";

export type IconProps = Omit<SVGAttributes<SVGSVGElement>, "children"> & {
  icon: keyof typeof IconsMap;
};

export type IconsMap = (typeof IconsMap)[keyof typeof IconsMap];
export const IconsMap = {
  send: IconSend,
  ellipsis: IconEllipsis,
  "ellipsis-vertical": IconEllipsisVertical,
  plus: IconPlus,
  bars: IconBars,
  "pen-to-square": IconPenToSquare,
  brand: IconBrand,
  "chevron-down": IconChevronDown,
  gear: IconGear,
  circle: IconCircle,
  ["brand-hollow"]: IconBrandHollow,
  "side-bar": IconSidebar,
} as const;

export function Icon({ icon, ...props }: IconProps) {
  const Component = IconsMap[icon];
  if (!Component) throw new Error(`Component "${icon}" does not exist`);
  return <Component {...props} />;
}
