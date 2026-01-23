import { Fragment, h } from "preact";
import { SideBarLeft } from "../../sections/side-bar-left/side-bar-left.tsx";
import { PageBody } from "../../sections/page-body/page-body.tsx";

export function BudgetPage() {
  return (
    <Fragment>
      <SideBarLeft />
      <PageBody>
        <div>Budget page</div>
      </PageBody>
    </Fragment>
  );
}