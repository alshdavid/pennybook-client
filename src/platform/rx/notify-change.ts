export function notifyChange(self: EventTarget) {
  self.dispatchEvent(new Event("change"));
}
