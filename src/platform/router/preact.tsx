import {
  ComponentChild,
  h,
  render,
  type VNode,
  createContext,
  Component,
  ComponentType,
} from "preact";
import { Req, Router, RouterOptions } from "./router.ts";
import { useContext } from "preact/hooks";

export type PreactRouterOptions = RouterOptions & {
  root: HTMLElement;
  providers?: Array<VNode>;
};

// @ts-expect-error
export const RouterContext = createContext<PreactRouter>(null);
export const useRouter = () => useContext(RouterContext);

export class PreactRouter extends Router {
  #root: HTMLElement;
  #providers: Array<VNode>;
  #routeEvents: EventTarget;

  constructor({
    root: target,
    providers = [],
    ...routerOptions
  }: PreactRouterOptions) {
    super(routerOptions);
    this.#root = target;
    this.#providers = providers;
    this.#routeEvents = new EventTarget();
  }

  mount(
    path: string | Array<string>,
    Element: (props: { req: Req }) => ComponentChild,
  ) {
    return this.route(path, (req) => {
      this.#root.setAttribute("data-route", req.routePattern);
      this.#routeEvents.dispatchEvent(
        new CustomEvent("route", { detail: Element }),
      );
    });
  }

  mountAsync(
    path: string,
    fac: () => Promise<(props: { req: Req }) => ComponentChild>,
  ) {
    return this.route(path, async (req) => {
      this.#root.setAttribute("data-route", "loading");
      this.#routeEvents.dispatchEvent(
        new CustomEvent("route", { detail: <div></div> }),
      );
      const Element = await fac();
      this.#root.setAttribute("data-route", req.routePattern);
      this.#routeEvents.dispatchEvent(
        new CustomEvent("route", { detail: Element }),
      );
    });
  }

  start() {
    render(
      <RoutedApp
        providers={this.#providers}
        router={this}
        routeEvents={this.#routeEvents}
      />,
      this.#root,
    );
    super.start();
  }
}

type RoutedAppProps = {
  providers: Array<VNode>;
  router: PreactRouter;
  routeEvents: EventTarget;
};

type RoutedAppState = {
  CurrentComponent?: any;
};

class RoutedApp extends Component<RoutedAppProps, RoutedAppState> {
  Wrapper: any;

  constructor(props: RoutedAppProps) {
    super(props);
    this.Wrapper = ({ target }: any) => {
      let wrapped: VNode = (
        <RouterContext.Provider value={this.props.router}>
          {target}
        </RouterContext.Provider>
      );

      for (let i = this.props.providers.length - 1; i >= 0; i--) {
        const provider = this.props.providers[i];
        const Provider = provider.type as ComponentType<any>;
        const providerProps = provider.props || {};
        wrapped = <Provider {...providerProps}>{wrapped}</Provider>;
      }

      return wrapped;
    };
  }

  componentDidMount(): void {
    this.props.routeEvents.addEventListener("route", this.onRoute as any);
  }

  componentWillUnmount(): void {
    this.props.routeEvents.removeEventListener("route", this.onRoute as any);
  }

  onRoute = ({ detail }: { detail: any }) => {
    this.setState({
      CurrentComponent: detail,
    });
  };

  render() {
    const C = this.state.CurrentComponent;
    if (!C) return null;
    const Wrapper = this.Wrapper;
    return <Wrapper target={<C />} />;
  }
}
