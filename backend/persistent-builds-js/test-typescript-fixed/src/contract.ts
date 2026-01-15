
import { NearBindgen, near, view, call } from 'near-sdk-js';

@NearBindgen({})
class HelloNEAR {
  greeting: string = 'Hello from TypeScript!';

  @view({})
  get_greeting(): string {
    return this.greeting;
  }

  @call({})
  set_greeting({ message }: { message: string }): void {
    near.log(`Setting greeting: ${message}`);
    this.greeting = message;
  }

  @view({})
  get_account_id(): string {
    return near.currentAccountId();
  }
}

export default HelloNEAR;  // ✅ Required for near-sdk-js!
