
import { NearBindgen, near, call, view } from 'near-sdk-js';

@NearBindgen({})
class Counter {
  count = 0;

  @view({})
  get_count() {
    return this.count;
  }

  @call({})
  increment() {
    this.count += 1;
    near.log(`Count is now: ${this.count}`);
  }
}
