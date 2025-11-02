import { matchPath, normalizePathname } from "./url-parser.ts"

export type HandlerFunc = (req: Req) => any | Promise<any>
export type Req = {
  routePattern: string
  url: URL,
  params: Record<string, string>
}

export class Router {
  #routes: Map<string, HandlerFunc>
  #req: Req | undefined

  constructor() {
    this.#routes = new Map()
  }

  start() {
    this.#digest()
  }

  get req(): Req {
    if (!this.#req) {
      throw new Error("Router hasn't started yet")
    }
    return this.#req
  }

  // route(regex: RegExp, handler: HandlerFunc): Router
  // route(paths: string[], handler: HandlerFunc): Router
  // route(path: string, handler: HandlerFunc<T>): Router
  route(path: string, handler: HandlerFunc): Router {
    const normalizedPath = normalizePathname(path)
    this.#routes.set(normalizedPath, handler)
    return this
  }

  navigate(path: string) {
    const normalizedPathname = normalizePathname(path);
    window.history.pushState(null, document.title, normalizedPathname);
    this.#digest()
  }

  replace(path: string) {
    const normalizedPathname = normalizePathname(path);
    window.history.replaceState(null, document.title, normalizedPathname);
    this.#digest()
  }

  back() {
    window.addEventListener("popstate", () => this.#digest(), { once: true })
    window.history.back();
  }

  forward() {
    window.addEventListener("popstate", () => this.#digest(), { once: true })
    window.history.forward();
  }

  #digest() {
    const normalizedPath = normalizePathname(globalThis.location.pathname)
    const [handler, params] = this.#matchRoute(normalizedPath)
    if (!handler) {
      return
    }
    const req = {
      routePattern: "",
      url: new URL(globalThis.location.href),
      params: params || {},
    }
    this.#req = req
    handler(req)
  }

  #matchRoute(pathname: string): [HandlerFunc?, Record<string, string>?] {
    if (this.#routes.has(pathname)) {
      return [this.#routes.get(pathname)!, {}]
    }
    for (const [pattern, handler] of this.#routes.entries()) {
      const result = matchPath(pattern, pathname)
      if (result) {
        return [handler, result]
      }
    }
    return []
  }
}
