import { Fragment, h } from "preact";
import { SideBarLeft } from "../../sections/side-bar-left/side-bar-left.tsx";
import { useRouter } from "../../platform/router/preact.tsx";
import { PageBody } from "../../sections/page-body/page-body.tsx";

export function NotFoundPage() {
  const router = useRouter();

  return (
    <Fragment>
      <SideBarLeft />
      <PageBody>
        <p>Not Found</p>
        <div>
          <pre>{JSON.stringify(router.req, null, 2)}</pre>
        </div>
      </PageBody>
    </Fragment>
  );
}
