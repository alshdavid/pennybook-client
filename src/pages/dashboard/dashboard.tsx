import { Fragment, h } from "preact";
import { SideBarLeft } from "../../sections/side-bar-left/side-bar-left.tsx";
import { PageBody } from "../../sections/page-body/page-body.tsx";

export function DashboardPage() {
  return (
    <Fragment>
      <SideBarLeft />
      <PageBody>
        <div>Dashboard page</div>
      </PageBody>
    </Fragment>
  );
}