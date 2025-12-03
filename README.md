# @xan/async-subject

A set of tooling that encapsulates an object that acts as a variant of
[`Subject`](https://jsr.io/@xan/subject/doc/~/Subject) to be used if you only care about the final
[`nexted`](https://jsr.io/@xan/observer/doc/~/Observer.next) value (if any) before
[`return`](https://jsr.io/@xan/observer/doc/~/Observer.return).

## Build

Automated by [JSR](https://jsr.io/).

## Publishing

Automated by `.github\workflows\publish.yml`.

## Running unit tests

Run `deno task test` or `deno task test:ci` to execute the unit tests via
[Deno](https://deno.land/).

## Example

```ts
import { AsyncSubject } from "@xan/async-subject";
import { Observer } from "@xan/observer";

const subject = new AsyncSubject<number>();
subject.next(1);
subject.next(2);

subject.subscribe(new Observer((value) => console.log(value)));

subject.next(3);

subject.return(); // Console output: 3

subject.subscribe(new Observer((value) => console.log(value))); // Console output: 3
```

# Glossary And Semantics

- [@xan/observer](https://jsr.io/@xan/observer#glossary-and-semantics)
- [@xan/observable](https://jsr.io/@xan/observable#glossary-and-semantics)
- [@xan/subject](https://jsr.io/@xan/subject#glossary-and-semantics)
