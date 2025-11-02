// @ts-expect-error
import { SQLite, IndexedDbFS, MemoryFS } from "@alshdavid/sqlite-web";
import { ConnectionManager } from "@alshdavid/shared-worker/connection-manager.ts";

const app = new ConnectionManager();

app.addEventListener("connect", async ({ data: conn }) => {
  // console.log("Connected", conn.id());

  conn.addEventListener("message", async (event) => {
    const { data } = event as MessageEvent;
    const [ref, kind, payload] = data;

    try {
      switch (kind) {
        case 0: {
          let result = await exec(payload);
          conn.postMessage([ref, 0, result]);
          break;
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        conn.postMessage([ref, 1, { message: err.message, stack: err.stack }]);
      } else {
        conn.postMessage([ref, 1, JSON.stringify(err)]);
      }
    }
  });

  conn.addEventListener(
    "disconnect",
    (_e) => console.log("Disconnected", conn.id()),
    { once: true }
  );
});

let sqlite: any;
let db: any;

async function exec(sql: string): Promise<Array<any>> {
  if (!sqlite) {
    sqlite = await SQLite.initialize({
      fs: MemoryFS,
    });

    db = await sqlite.open("test");
  }

  return db.exec(sql);
}
