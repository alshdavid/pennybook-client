import { Fragment, h } from "preact";
import { SideBarLeft } from "../../sections/side-bar-left/side-bar-left.tsx";
import { PageBody } from "../../sections/page-body/page-body.tsx";

export function AccountsDetailPage() {
  return (
    <Fragment>
      <SideBarLeft />
      <PageBody>
        <div>Accounts Detail page</div>
      </PageBody>
    </Fragment>
  );
}