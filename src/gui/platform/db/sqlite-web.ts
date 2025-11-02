import { SharedWorker } from "@alshdavid/shared-worker/shared-worker.js";
import { IDatabase } from "./database.ts";

export class SQliteWeb implements IDatabase {
  #worker: SharedWorker

  constructor(worker: SharedWorker) {
    this.#worker = worker
  }

  exec<Result extends Record<string, string | number | boolean>>(sql: string): Promise<Array<Result>> {
    const id = crypto.randomUUID();

    const result = new Promise<any>((res, rej) => {
      const onMessage = (event: Event) => {
        const { data } = event as MessageEvent;
        const [ref, status, result] = data;
        if (ref === id) {
          if (status === 1) {
            rej(result);
          } else {
            res(result);
          }
          this.#worker.removeEventListener("message", onMessage);
        }
      }
      this.#worker.addEventListener("message", onMessage);
    });

    this.#worker.postMessage([id, 0, sql]);
    return result;
  }
}
