import "./page-body.scss";
import { Fragment, h } from "preact";

export function PageBody({ children = null }: { children: any }) {
  return (
    <Fragment>
      <main className="section-page-body">
        <section className="main-contents-body">{children}</section>
      </main>
    </Fragment>
  );
}
