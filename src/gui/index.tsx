import "./styles.css";
import { h, render, type TargetedKeyboardEvent } from "preact";
import { SharedWorker } from "@alshdavid/shared-worker/shared-worker.ts";
import { useState } from "preact/hooks";

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

// @ts-expect-error
globalThis.exec = exec;

function App() {
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('SELECT * FROM test_table;')
  const [result, setResult] = useState([])
  const [error, setError] = useState<null | string>(null)
  const rows = rowsToTable(result)

  async function submit() {
    if (loading) {
      return
    }
    setLoading(true)
    setError(null)
    setResult([])

    try {
      const result = await exec(query)
      setResult(result)
      setQuery('')
    } catch (error: any) {
      setError(error.message)
    }

    setLoading(false)
  }

  function onEnter(event: TargetedKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        submit()
    }
  }

  return (
    <div>
      <textarea
        disabled={loading}
        placeholder="Write SQL here"
        onKeyDown={onEnter}
        value={query}
        onInput={(e: any) => setQuery(e.target.value)} />

      <button 
        disabled={loading}
        onClick={submit}>Exec</button>

      <h1>Result:</h1>

      {error && <div>Error: {error}</div>}
      {rows.length ? <table>
        {rows.map(entry => <tr>
          {entry.map(key => <td>{key}</td>)}
        </tr>)}
      </table> : null}
    </div>
  );
}

render(<App />, document.body);


function rowsToTable<T extends Record<string, any>>(rows: T[]): string[][] {
  if (rows.length === 0) {
    return [];
  }
  
  const headers = Object.keys(rows[0]);
  
  const values = rows.map(row => 
    headers.map(header => String(row[header]))
  );
  
  return [headers, ...values];
}