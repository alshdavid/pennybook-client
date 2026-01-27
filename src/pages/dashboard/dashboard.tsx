import { Fragment, h } from "preact";
import { SideBarLeft } from "../../sections/side-bar-left/side-bar-left.tsx";
import { PageBody } from "../../sections/page-body/page-body.tsx";
import { useState } from "preact/hooks";
import { rx } from "../../platform/rx/rx.ts";
import { notifyChange } from "../../platform/rx/notify-change.ts";
import { useViewModel } from "../../platform/rx/use-view-model.ts";

class DashboardViewModel extends EventTarget {
  @rx accessor handle: any
  @rx accessor data: [number]

  constructor() {
    super()
    this.data = [0]
  }

  async loadJsonFile() {
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
    this.handle = handle
    this.data = data
  }

  async saveJsonFile() {
    const writable = await this.handle.createWritable();
    await writable.write(JSON.stringify(this.data, null, 2));
    await writable.close();
}

  async increment() {
    this.data[0] += 1
    await this.saveJsonFile()
    notifyChange(this)
  }
}

export function DashboardPage() {
  const vm = useViewModel(DashboardViewModel, [])

  return (
    <Fragment>
      <SideBarLeft />
      <PageBody>
        <div>Dashboard page</div>
        <button onClick={() => vm.loadJsonFile()}>Load</button>
        <button onClick={() => vm.increment()}>++</button>
        <div>
          <pre>{JSON.stringify(vm.data, null, 2)}</pre>
        </div>
      </PageBody>
    </Fragment>
  );
}
