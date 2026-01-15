import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ message } = { message: "Hello, NEAR storage!" }) {
    this.message = message;
  }

  @view({})
  get_message() {
    return this.message;
  }

  @call({})
  set_message({ message }) {
    near.log(`Saving message: ${message}`);
    this.message = message;
  }
}

export default Contract;