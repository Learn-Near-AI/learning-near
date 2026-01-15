
import { NearBindgen, near, view, call } from 'near-sdk-js';

@NearBindgen({})
class Counter {
  counter = 0;

  @view({})
  get_counter() {
    return this.counter;
  }

  @call({})
  increment() {
    this.counter += 1;
    near.log(`Counter incremented to: ${this.counter}`);
  }

  @call({})
  decrement() {
    this.counter -= 1;
    near.log(`Counter decremented to: ${this.counter}`);
  }

  @call({})
  reset() {
    this.counter = 0;
    near.log('Counter reset to 0');
  }
}
