import { NearBindgen, view, call, near } from 'near-sdk-js';

@NearBindgen({})
class Contract {
  owner_id = '';

  @call({})
  init({ owner_id }) {
    this.owner_id = owner_id;
  }

  @view({})
  get_owner() {
    return this.owner_id;
  }
}

export default Contract;
