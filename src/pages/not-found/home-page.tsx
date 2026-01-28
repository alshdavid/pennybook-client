import { Fragment, h } from "preact";
import { useRouter } from "../../platform/router/preact.tsx";

export function NotFoundPage() {
  const router = useRouter();

  return (
    <Fragment>
      <p>Not Found</p>
      <div>
        <pre>{JSON.stringify(router.req, null, 2)}</pre>
      </div>
    </Fragment>
  );
}
