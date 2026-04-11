import { type ConnectionManager } from "./connection-manager.ts";

export function patchConsole(clients: ConnectionManager) {
  const og = {};

  for (const method of ["log", "warn", "info"]) {
    // @ts-expect-error
    og[method] = globalThis.console[method];

    // @ts-expect-error
    globalThis.console[method] = (...args) => {
      // @ts-expect-error
      og[method](args);
      const serdeArgs = [];
      for (const arg of args) {
        // @ts-ignore
        if ({ string: true, boolean: true, number: true }[typeof arg]) {
          serdeArgs.push(arg);
        } else {
          try {
            serdeArgs.push(JSON.stringify(arg));
          } catch (error) {
            serdeArgs.push(typeof arg);
          }
        }
      }
      clients.postMessageAll({
        action: method,
        payload: {
          args: serdeArgs,
        },
      });
    };
  }
}

export function globalErrorHandler(clients: ConnectionManager) {
  globalThis.addEventListener("error", (event: ErrorEvent) => {
    clients.postMessageAll({
      action: "error",
      payload: {
        message: event.message,
        stack: event.error?.stack,
      },
    });
  });
}
