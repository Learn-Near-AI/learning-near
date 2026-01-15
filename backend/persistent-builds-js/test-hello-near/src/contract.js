import { NearBindgen, near, call, view, initialize } from 'near-sdk-js';

@NearBindgen({})
class HelloNear {
  greeting = "Hello";

  @initialize({})
  init({ greeting }) {
    this.greeting = greeting;
  }

  @call({})
  set_greeting({ greeting }) {
    near.log(`Saving greeting: ${greeting}`);
    this.greeting = greeting;
  }

  @view({})
  get_greeting() {
    return this.greeting;
  }
}