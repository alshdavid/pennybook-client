import "./side-bar-left.scss";
import { h } from "preact";
import { Icon } from "../../components/icon/icon.tsx";
import { useRouter } from "../../platform/router/preact.tsx";

export function SideBarLeft() {
  const router = useRouter();

  function navigate(route: string) {
    return {
      href: route,
      onClick: (e: MouseEvent) => {
        e.preventDefault();
        router.navigate("/accounts");
      },
    };
  }

  return (
    <nav className="side-bar-left">
      <div className="top-bar">
        <div className="logo">
          <Icon icon="brand-hollow" />
          <span>pennybook</span>
        </div>
      </div>
      <section>
        <a
          {...navigate("/dashboard")}
          className="large active"
        >
          Dashboard
        </a>
        <a {...navigate("/budget")} className="large">
          Budget
        </a>
        <a {...navigate("/query")} className="large">
          Query
        </a>
      </section>
      <section>
        <a
          {...navigate("/accounts")}
          className="account heading"
        >
          <span>All Accounts</span>
          <span>100,000</span>
        </a>
        <a {...navigate("/accounts/1")} className="account">
          <span>General</span>
          <span>1,000</span>
        </a>
        <a {...navigate("/accounts/2")} className="account">
          <span>Savings</span>
          <span>9,000</span>
        </a>
        <br />
        <div className="account heading">
          <span>Closed Accounts</span>
          <span>0</span>
        </div>
      </section>
    </nav>
  );
}
