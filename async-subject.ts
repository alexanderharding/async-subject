import { isObserver, Observer } from "@xan/observer";
import { Subject } from "@xan/subject";
import { Observable } from "@xan/observable";
import type { AsyncSubjectConstructor } from "./async-subject-constructor.ts";

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
  readonly #subject = new Subject();
  readonly signal = this.#subject.signal;
  #value: unknown = noValue;
  readonly #observable = new Observable((observer) =>
    this.#subject.subscribe({
      signal: observer.signal,
      next: () => {},
      return: () => {
        if (this.#value !== noValue) observer.next(this.#value);
        observer.return();
      },
      throw: (value) => observer.throw(value),
    })
  );

  constructor() {
    Object.freeze(this);
    this.#subject.subscribe(
      new Observer({
        next: (value) => (this.#value = value),
        // We have entered the error flow so we need to reset the value state
        // since it is no longer relevant and should be dereferenced.
        throw: () => (this.#value = noValue),
      }),
    );
  }

  next(value: unknown): void {
    if (this instanceof AsyncSubject) this.#subject.next(value);
    else throw new TypeError("'this' is not instanceof 'AsyncSubject'");
  }

  return(): void {
    if (this instanceof AsyncSubject) this.#subject.return();
    else throw new TypeError("'this' is not instanceof 'AsyncSubject'");
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
    this.#observable.subscribe(observer);
  }
};

Object.freeze(AsyncSubject);
Object.freeze(AsyncSubject.prototype);
