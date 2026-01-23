// @ts-expect-error
import css from "./app-contenteditable.css?type=raw";

/* 
  Using a custom element for the content editable textarea
  because managing React's state lifecycle/sync with the
  contents of the component became tricky - resulting in
  the cursor jumping unexpectedly.

  A custom element could be validated in isolation of React
  and added in with bindings.

  This has limitations, such as not being able to be SSR'd
  via "renderToStream" - but that's okay.
*/
const styles = new CSSStyleSheet();
styles.replaceSync(css);

export class HTMLContentEditable extends HTMLElement {
  shadowRoot;
  #value: string;
  #$editable: HTMLDivElement;

  get disabled(): boolean {
    return !(
      !this.hasAttribute("disabled") ||
      this.getAttribute("disabled") === "false"
    );
  }

  set disabled(value: boolean) {
    this.setAttribute("disabled", `${value}`);
    this.#$editable.setAttribute("disabled", `${value}`);
    this.#$editable.setAttribute("contenteditable", `${!this.disabled}`);
  }

  get placeholder(): string | null {
    return this.getAttribute("placeholder");
  }

  set placeholder(value: string) {
    this.setAttribute("placeholder", value);
    this.#$editable.setAttribute("data-placeholder", value);
  }

  get value() {
    return this.#value;
  }

  set value(value: string) {
    if (this.#value === value) return;
    this.#value = value;
    this.#$editable.innerText = this.#value;
  }

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: "open", delegatesFocus: true });
    this.shadowRoot.adoptedStyleSheets = [styles];

    this.#$editable = globalThis.document.createElement("div");

    const placeholder = this.getAttribute("placeholder");
    if (placeholder) {
      this.#$editable.setAttribute("data-placeholder", placeholder);
    }

    const disabled =
      this.hasAttribute("disabled") || this.getAttribute("disabled") === "true";
    if (disabled) {
      this.#$editable.setAttribute("disabled", `${disabled}`);
    }

    this.#$editable.setAttribute("contenteditable", `${!disabled}`);
    this.#value = this.getAttribute("value") || "";

    this.shadowRoot.appendChild(this.#$editable);

    this.addEventListener("input", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.addEventListener("blur", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.addEventListener("focus", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    this.addEventListener("paste", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    this.#$editable.addEventListener("input", () => {
      if (this.#$editable.innerText === "\n") {
        this.#$editable.innerHTML = "";
      }
      this.#value = this.#$editable.innerText;
      this.dispatchEvent(new InputEvent("input", { bubbles: true }));
    });

    this.addEventListener("paste", (e) => {
      const text = e.clipboardData?.getData("text/plain");
      if (!text) return;

      const selection = window.getSelection();
      if (!selection?.rangeCount) return;

      const range = selection.getRangeAt(0);
      range.deleteContents();

      const textNode = document.createTextNode(text);
      range.insertNode(textNode);

      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      this.#value = this.#$editable.innerText;
      this.dispatchEvent(
        new InputEvent("input", { bubbles: true, composed: true }),
      );
    });
  }

  static register(name = "app-contenteditable") {
    customElements.define(name, HTMLContentEditable);
  }

  focus = () => {
    this.#$editable.focus();
  };

  blur = () => {
    this.#$editable.blur();
  };
}
