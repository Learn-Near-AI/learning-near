import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class TokenContract {
  constructor() {
    this.balances = {};
    this.totalSupply = 0;
  }

  @call({})
  mint({ account, amount }) {
    this.balances[account] = (this.balances[account] || 0) + amount;
    this.totalSupply += amount;
    near.log(`Minted ${amount} tokens to ${account}`);
  }

  @view({})
  get_balance({ account }) {
    return this.balances[account] || 0;
  }

  @view({})
  get_total_supply() {
    return this.totalSupply;
  }
}

export default TokenContract;