import "./styles.css";
import { h, render } from "preact";
import { SharedWorker } from "@alshdavid/shared-worker/shared-worker.ts";

const worker = new SharedWorker(globalThis.importMap.resolve("worker")!, {
  type: "module",
});

function exec(sql: string) {
  const id = crypto.randomUUID();

  const result = new Promise<any>((res, rej) => {
    function onMessage(event: Event) {
      const { data } = event as MessageEvent;
      const [ref, status, result] = data;
      if (ref === id) {
        if (status === 1) {
          rej(result);
        } else {
          res(result);
        }
        worker.removeEventListener("message", onMessage);
      }
    }
    worker.addEventListener("message", onMessage);
  });

  worker.postMessage([id, 0, sql]);
  return result;
}

async function sql(template: TemplateStringsArray) {
  return exec(template[0]);
}

// @ts-expect-error
globalThis.exec = exec;

await sql`CREATE TABLE IF NOT EXISTS test_table ("id" TEXT UNIQUE, "val" TEXT);`;

// await exec("INSERT INTO test_table (id, val) VALUES ('1', 'v1')")
// await exec("INSERT INTO test_table (id, val) VALUES ('2', 'v2')")
// await exec("INSERT INTO test_table (id, val) VALUES ('3', 'v3')")

console.log(await sql`SELECT * FROM test_table;`);

function App() {
  return (
    <div>
      <h1>Website Template</h1>
      <p>Basic starter template for bundled websites using Preact</p>
      <p>
        <b>It Features;</b>
      </p>
      <ul>
        <li>Rspack bundler</li>
        <li>TypeScript</li>
        <li>Preact</li>
        <li>CSS Modules/Nesting</li>
        <li>Web Workers</li>
        <li>Bundle Size Stats</li>
        <li>Workflow to publish to GitHub Pages</li>
        <li>
          Template distributes 5kb of content (Preact, CSS, Worker + App code)
        </li>
      </ul>
      <div>
        <a href="https://github.com/alshdavid-templates/website-template">
          GitHub Repo
        </a>
      </div>
    </div>
  );
}

render(<App />, document.body);
