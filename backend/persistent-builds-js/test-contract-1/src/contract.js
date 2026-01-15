import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ balances } = { balances: {} }) {
    this.balances = balances || {};
  }

  @view({})
  get_balance({ account }) {
    return this.balances[account] || 0;
  }

  @call({})
  set_balance({ account, amount }) {
    this.balances[account] = amount;
  }
}

export default Contract;