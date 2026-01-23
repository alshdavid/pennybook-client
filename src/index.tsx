import "./styles.scss";
import { Fragment, h, render } from "preact";
import { Icon } from "./components/icon/icon.tsx";
import { Button } from "./components/button/button.tsx";
import { Bubble } from "./components/bubble/bubble.tsx";
import { useViewModel } from "./platform/rx/use-view-model.ts";
import { PreactRouter } from "./platform/router/preact.tsx";
import { AUTO_BASE_HREF } from "./platform/router/router.ts";
import { HomePage } from "./pages/home/home-page.tsx";
import { NotFoundPage } from "./pages/not-found/home-page.tsx";

const app = new PreactRouter({
  root: document.body,
  baseHref: AUTO_BASE_HREF,
  providers: []
})

app.mount(['/', '/index.html'], () => <HomePage />)
app.mount('/**', () => <NotFoundPage />)

app.start()