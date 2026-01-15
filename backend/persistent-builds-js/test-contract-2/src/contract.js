import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  assert_positive({ value }) {
    if (value <= 0) {
      near.panic("VALUE_MUST_BE_POSITIVE");
    }
  }

  @call({})
  assert_owner({ account_id }) {
    if (near.currentAccountId() !== account_id) {
      near.panic("ONLY_OWNER");
    }
  }
}

export default Contract;