import { PreactRouter } from "../../../kit/router/preact.tsx";
import { AccountModel, Accounts } from "../../platform/accounts/accounts.ts";
import { useInject } from "../../platform/preact/inject.ts";
import {
  ChangeType,
  observeProperties,
  OnInit,
  useViewModel,
  ViewModel,
} from "../../platform/preact/reactive.ts";
import "./database-select.scss";
import { h } from "preact";

class DatabaseSelectPageVM extends ViewModel implements OnInit {
  #accounts: Accounts;
  accounts: Array<AccountModel>;

  constructor(accounts: Accounts) {
    super();
    this.#accounts = accounts;
    this.accounts = [];

    observeProperties(this, {
      accounts: ChangeType.Push,
    });
  }

  async onInit() {
    this.accounts = await this.#accounts.getAccounts();
  }

  async addAccount() {
    const result = prompt("What is the account name?");
    if (!result) {
      return;
    }
    await this.#accounts.addAccount(result);
    this.accounts = await this.#accounts.getAccounts();
    console.log(this.accounts)
  }
}

export function DatabaseSelectPage() {
  const accounts = useInject(Accounts);
  const router = useInject(PreactRouter);
  const vm = useViewModel(DatabaseSelectPageVM, [accounts]);

  return (
    <div>
      <div>
        {" "}
        Account Select{" "}
        <button onClick={() => vm.addAccount()}>Add Account</button>
      </div>

      {vm.accounts.map((account) => (
        <button onClick={() => router.navigate(`/accounts/${account.id}`)}>{JSON.stringify(account)}</button>
      ))}
    </div>
  );
}
