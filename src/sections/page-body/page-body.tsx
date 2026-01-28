import "./page-body.scss";
import { Fragment, h } from "preact";
import { SideBarLeft } from "../side-bar-left/side-bar-left.tsx";

export function PageBody({ children = null }: { children: any }) {
  return (
    <Fragment>
      <SideBarLeft />

      <main className="section-page-body">
        <section className="main-contents-body">{children}</section>
      </main>
    </Fragment>
  );
}
