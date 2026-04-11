export class Connection extends EventTarget {
  #port: MessagePort;
  #id: string;
  #listeners: Map<
    string,
    Set<
      (
        v: any,
        res: { res: (v: any) => void; err: (e: any) => void },
      ) => any | Promise<any>
    >
  >;

  constructor(port: MessagePort, id: string) {
    super();
    this.#listeners = new Map();

    navigator.locks.request(id, (_lock) => {
      console.log(this.#port);
      this.#port.dispatchEvent(new Event("disconnect"));
    });

    this.#port = port;
    this.#id = id;
    this.addEventListener("message", this.#defaultListener);
  }

  #defaultListener = ({
    data,
  }: {
    data: { id?: string; action: string; payload: unknown };
  }) => {
    const { id, action, payload } = data;
    const listeners = this.#listeners.get(action) || new Set();
    for (const listener of listeners.values())
      listener(payload, {
        res: (data) => this.postMessage({ id, payload: { response: data } }),
        err: (data) => this.postMessage({ id, payload: { error: data } }),
      });
  };

  id() {
    return this.#id;
  }

  postMessage(...args: Parameters<MessagePort["postMessage"]>) {
    return this.#port.postMessage(...args);
  }

  // @ts-expect-error
  addEventListener(
    message: string,
    cb: (event: {
      data: { id?: string; action: string; payload: unknown };
    }) => any,
    options?: { once?: boolean },
  );
  // @ts-expect-error
  addEventListener(...args: any) {
    // @ts-expect-error
    return this.#port.addEventListener(...args);
  }

  removeEventListener(...args: Parameters<MessagePort["removeEventListener"]>) {
    return this.#port.removeEventListener(...args);
  }

  onDisconnect(callback: () => any | Promise<any>) {
    this.addEventListener("disconnect", callback, { once: true });
  }

  subscribe<T, R = any>(
    action: string,
    callback: (
      payload: T,
      res: { res: (v: any) => void; err: (e: any) => void },
    ) => any,
  ): () => void {
    const listeners = this.#listeners.get(action) || new Set();
    listeners.add(callback);
    this.#listeners.set(action, listeners);
    return () => listeners.delete(callback);
  }

  send(action: string, payload?: any): void {
    this.postMessage({ action, payload });
  }
}
