import { Fragment, h } from "preact";
import { rx } from "../../platform/rx/rx.ts";
import { notifyChange } from "../../platform/rx/notify-change.ts";
import { useViewModel } from "../../platform/rx/use-view-model.ts";

class DashboardViewModel {
  @rx accessor handle: any;
  @rx accessor data: [number];

  constructor() {
    this.data = [0];
  }

  async loadJsonFile() {
    // @ts-expect-error
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: "JSON Files",
          accept: { "application/json": [".json"] },
        },
      ],
    });

    const file = await handle.getFile();
    const content = await file.text();

    const data = JSON.parse(content);
    console.log("Your data:", data);
    this.handle = handle;
    this.data = data;
  }

  async saveJsonFile() {
    const writable = await this.handle.createWritable();
    await writable.write(JSON.stringify(this.data, null, 2));
    await writable.close();
  }

  async increment() {
    this.data[0] += 1;
    await this.saveJsonFile();
    notifyChange(this);
  }
}

export function DashboardPage() {
  const vm = useViewModel(DashboardViewModel, []);

  return (
    <Fragment>
      <div>Dashboard page</div>
      <button onClick={() => vm.loadJsonFile()}>Load</button>
      <button onClick={() => vm.increment()}>++</button>
      <div>
        <pre>{JSON.stringify(vm.data, null, 2)}</pre>
      </div>
    </Fragment>
  );
}
