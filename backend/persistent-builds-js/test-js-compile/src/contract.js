import { NearBindgen, near, view, call } from 'near-sdk-js';

@NearBindgen({})
class HelloNEAR {
  greeting = 'Hello';

  @view({})
  get_greeting() {
    return this.greeting;
  }

  @call({})
  set_greeting({ message }) {
    near.log(`Saving greeting: ${message}`);
    this.greeting = message;
  }
}

export default HelloNEAR;
