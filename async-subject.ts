import { isObserver, type Observer } from "@xan/observer";
import type { Subject } from "@xan/subject";
import type { AsyncSubjectConstructor } from "./async-subject-constructor.ts";
import { ReplaySubject } from "@xan/replay-subject";

/**
 * Object type that acts as a variant of [`Subject`](https://jsr.io/@xan/subject/doc/~/Subject).
 */
export type AsyncSubject<Value = unknown> = Subject<Value>;

/**
 * Flag indicating that a value is not set.
 *
 * @internal Do NOT export.
 */
const noValue = Symbol("Flag indicating that a value is not set.");

export const AsyncSubject: AsyncSubjectConstructor = class {
  readonly [Symbol.toStringTag] = "AsyncSubject";
  readonly #subject = new ReplaySubject(1);
  readonly signal = this.#subject.signal;
  #value: unknown = noValue;

  constructor() {
    Object.freeze(this);
    this.signal.addEventListener("abort", () => (this.#value = noValue), {
      once: true,
    });
  }

  next(value: unknown): void {
    if (!(this instanceof AsyncSubject)) {
      throw new TypeError("'this' is not instanceof 'AsyncSubject'");
    }
    if (!this.signal.aborted) this.#value = value;
  }

  return(): void {
    if (!(this instanceof AsyncSubject)) {
      throw new TypeError("'this' is not instanceof 'AsyncSubject'");
    }
    if (this.#value !== noValue) this.#subject.next(this.#value);
    this.#subject.return();
  }

  throw(value: unknown): void {
    if (this instanceof AsyncSubject) this.#subject.throw(value);
    else throw new TypeError("'this' is not instanceof 'AsyncSubject'");
  }

  subscribe(observer: Observer): void {
    if (!(this instanceof AsyncSubject)) {
      throw new TypeError("'this' is not instanceof 'AsyncSubject'");
    }
    if (arguments.length === 0) {
      throw new TypeError("1 argument required but 0 present");
    }
    if (!isObserver(observer)) {
      throw new TypeError("Parameter 1 is not of type 'Observer'");
    }
    this.#subject.subscribe(observer);
  }
};

Object.freeze(AsyncSubject);
Object.freeze(AsyncSubject.prototype);
