import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id } = { owner_id: near.currentAccountId() }) {
    this.owner_id = owner_id;
  }

  @view({})
  get_owner() {
    return this.owner_id;
  }

  @call({})
  set_owner({ new_owner }) {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can change owner");
    }
    this.owner_id = new_owner;
  }
}
