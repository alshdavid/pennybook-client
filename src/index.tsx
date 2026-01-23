import "./styles.scss";
import { Fragment, h, render } from "preact";
import { Icon } from "./components/icon/icon.tsx";
import { Button } from "./components/button/button.tsx";
import { Bubble } from "./components/bubble/bubble.tsx";
import { useViewModel } from "./platform/rx/use-view-model.ts";

export class AppViewModel extends EventTarget {
  constructor() {
    super();
  }

  toggleMenuLeft() {
    document.body.classList.toggle("open");
  }
}

function App() {
  const vm = useViewModel(AppViewModel, []);

  return (
    <Fragment>
      <SideMenu />

      <main className="main-contents">
        <div className="floating-panel top-left">
          <Icon icon="brand-hollow" height="24px" />
          <Bubble>
            <Button onClick={vm.toggleMenuLeft} className="menu-button">
              <Icon icon="side-bar" height="15px" />
            </Button>
          </Bubble>
        </div>
      </main>
    </Fragment>
  );
}

render(<App />, document.body);

function SideMenu() {
  return <nav className="side-bar side-bar-left">
    <div className="top-bar">
      <div className="logo">
        <Icon icon="brand-hollow" />
        <span>pennybook</span>
      </div>
    </div>
  </nav>
}