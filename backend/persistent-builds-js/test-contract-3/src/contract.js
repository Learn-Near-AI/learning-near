import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ items } = { items: [] }) {
    this.items = items || [];
  }

  @view({})
  get_item({ index }) {
    return this.items[index] || null;
  }

  @view({})
  get_items_count() {
    return this.items.length;
  }

  @call({})
  add_item({ item }) {
    this.items.push(item);
  }
}

export default Contract;