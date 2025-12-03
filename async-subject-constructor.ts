import type { AsyncSubject } from "./async-subject.ts";

/**
 * Object interface for an {@linkcode AsyncSubject} factory.
 */
export interface AsyncSubjectConstructor {
  /**
   * Creates and returns an object that acts as a [`Subject`](https://jsr.io/@xan/subject/doc/~/Subject) that buffers the most recent
   * [`nexted`](https://jsr.io/@xan/observer/doc/~/Observer.next) value until [`return`](https://jsr.io/@xan/observer/doc/~/Observer.return) is called.
   * Once [`returned`](https://jsr.io/@xan/observer/doc/~/Observer.return), [`next`](https://jsr.io/@xan/observer/doc/~/Observer.next) will be replayed
   * to late [`consumers`](https://jsr.io/@xan/observer#consumer) upon [`subscription`](https://jsr.io/@xan/observable/doc/~/Observable.subscribe).
   * @example
   * ```ts
   * import { AsyncSubject } from "@xan/async-subject";
   * import { Observer } from "@xan/observer";
   *
   * const subject = new AsyncSubject<number>();
   * subject.next(1);
   * subject.next(2);
   *
   * subject.subscribe(new Observer((value) => console.log(value)));
   *
   * subject.next(3);
   *
   * subject.return(); // Console output: 3
   *
   * subject.subscribe(new Observer((value) => console.log(value))); // Console output: 3
   * ```
   */
  new (): AsyncSubject;
  new <Value>(): AsyncSubject<Value>;
  readonly prototype: AsyncSubject;
}
