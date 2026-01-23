import "./side-bar-left.scss"
import { h } from "preact";
import { Icon } from "../../components/icon/icon.tsx";

export function SideBarLeft() {
  return <nav className="side-bar-left">
    <div className="top-bar">
      <div className="logo">
        <Icon icon="brand-hollow" />
        <span>pennybook</span>
      </div>
    </div>
  </nav>
}