import { Connection } from "./connection.js";

export class ConnectionManager extends EventTarget {
  #connections: Set<Connection>;

  constructor() {
    super();
    this.#connections = new Set();

    globalThis.addEventListener("connect", async (event) => {
      const port = (event as MessageEvent).ports[0];

      const onReady = new Promise<MessageEvent>((res) =>
        port.addEventListener("message", res, { once: true })
      );

      port.start();
      const { data: id } = await onReady;

      port.postMessage(null)
      const conn = new Connection(port, id);

      conn.addEventListener("disconnect",
        () => this.#connections.delete(conn),
        { once: true }
      );

      this.#connections.add(conn);
      this.dispatchEvent(new MessageEvent("connect", { data: conn }));
    });
  }


  addEventListener(
    ...args: Array<any>
  ) {
    /// @ts-expect-error
    return super.addEventListener(...args);
  }

  getConnections() {
    return this.#connections.values();
  }

  postMessageAll(
    ...args: Parameters<MessagePort['postMessage']>
  ) {
    for (const conn of this.#connections.values()) {
      conn.postMessage(...args);
    }
  }

  onConnect(callback: (conn: Connection) => (any | Promise<any>)) {
    this.addEventListener("connect", ({ data: conn }: any) => {
      callback(conn)
    })
  }

  sendAll(action: string, payload?: any): void {
    this.postMessageAll({ action, payload })
  }
}
