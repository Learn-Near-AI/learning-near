
import { NearBindgen, near, view, call } from 'near-sdk-js';

@NearBindgen({})
class HelloNEAR {
  greeting = 'Hello from JavaScript';

  @view({})
  get_greeting() {
    return this.greeting;
  }

  @call({})
  set_greeting({ message }) {
    near.log(`Setting greeting: ${message}`);
    this.greeting = message;
  }

  @view({})
  get_account_id() {
    return near.currentAccountId();
  }
}

export default HelloNEAR;  // ✅ Required!
