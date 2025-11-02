import { cloneElement, ComponentChild, h, render, type VNode } from "preact";
import { Req, Router, RouterOptions } from "./router.ts";
import { useEffect, useState } from "preact/hooks";

export type PreactRouterOptions = RouterOptions & {
  target: HTMLElement;
  providers?: Array<VNode>;
};

export class PreactRouter extends Router {
  #target: HTMLElement;
  #providers: Array<VNode>;

  constructor({ target, providers = [], ...routerOptions }: PreactRouterOptions) {
    super(routerOptions);
    this.#target = target;
    this.#providers = providers;
  }

  mount(path: string, element: (props: { req: Req }) => ComponentChild) {
    return this.route(path, (req) => {
      render(
        null,
        this.#target
      );

      render(
        <App req={req} inner={element} providers={this.#providers} />,
        this.#target
      );
    });
  }
}

function App({
  req,
  inner,
  providers,
}: {
  req: Req;
  inner: (props: { req: Req }) => ComponentChild | Promise<ComponentChild>;
  providers: Array<VNode>;
}) {
  const [Element, setElement] = useState<null | ComponentChild>(null);

  useEffect(() => {
    (async () => {
      const element = await inner({ req });
      const wrapped = providers.reduceRight<ComponentChild>(
        (acc, wrapper) => cloneElement(wrapper, {}, acc),
        element
      );
      setElement(wrapped);
    })();
  }, []);

  if (!Element) {
    return null;
  }

  return Element;
}
