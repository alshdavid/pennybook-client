// async loadJsonFile() {
//   // @ts-expect-error
//   const [handle] = await window.showOpenFilePicker({
//     types: [
//       {
//         description: "JSON Files",
//         accept: { "application/json": [".json"] },
//       },
//     ],
//   });

//   const file = await handle.getFile();
//   const content = await file.text();

//   const data = JSON.parse(content);
//   console.log("Your data:", data);
//   this.handle = handle;
//   this.data = data;
// }

// async saveJsonFile() {
//   const writable = await this.handle.createWritable();
//   await writable.write(JSON.stringify(this.data, null, 2));
//   await writable.close();
// }

// async increment() {
//   this.data[0] += 1;
//   await this.saveJsonFile();
//   notifyChange(this);
// }
