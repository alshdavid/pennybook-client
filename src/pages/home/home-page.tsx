import { Fragment, h } from "preact";
import { SideBarLeft } from "../../sections/side-bar-left/side-bar-left.tsx";
import { PageBody } from "../../sections/page-body/page-body.tsx";

export function HomePage() {
  return (
    <Fragment>
      <SideBarLeft />
      <PageBody>
        <div>Home page</div>
      </PageBody>
    </Fragment>
  );
}