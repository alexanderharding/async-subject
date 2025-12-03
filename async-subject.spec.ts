import { assertEquals, assertStrictEquals, assertThrows } from "@std/assert";
import { AsyncSubject } from "./async-subject.ts";
import { Observer } from "@xan/observer";
import { Observable } from "@xan/observable";

Deno.test("AsyncSubject.toString should be '[object AsyncSubject]'", () => {
  // Arrange / Act / Assert
  assertStrictEquals(`${new AsyncSubject()}`, "[object AsyncSubject]");
});

Deno.test("AsyncSubject.constructor should be frozen", () => {
  // Arrange / Act / Assert
  assertStrictEquals(Object.isFrozen(AsyncSubject), true);
});

Deno.test("AsyncSubject should be frozen", () => {
  // Arrange / Act / Assert
  assertStrictEquals(Object.isFrozen(new AsyncSubject()), true);
});

Deno.test("AsyncSubject.prototype should be frozen", () => {
  // Arrange / Act / Assert
  assertStrictEquals(Object.isFrozen(AsyncSubject.prototype), true);
});

Deno.test(
  "AsyncSubject.constructor should not throw when creating with arguments",
  () => {
    // Arrange / Act / Assert
    new AsyncSubject(
      ...([1, 2, 3] as unknown as ConstructorParameters<typeof AsyncSubject>),
    );
  },
);

Deno.test(
  "AsyncSubject.constructor should throw when creating with arguments",
  () => {
    // Arrange / Act / Assert
    new AsyncSubject(
      ...([1, 2, 3] as unknown as ConstructorParameters<typeof AsyncSubject>),
    );
  },
);

Deno.test(
  "AsyncSubject should be an Observer which can be given to Observable.subscribe",
  () => {
    // Arrange
    const notifications: Array<["N", number] | ["R"] | ["T", unknown]> = [];
    const source = new Observable<number>((observer) => {
      for (const value of [1, 2, 3, 4, 5]) {
        observer.next(value);
        if (observer.signal.aborted) return;
      }
      observer.return();
    });
    const subject = new AsyncSubject<number>();

    // Act
    subject.subscribe(
      new Observer({
        next: (value) => notifications.push(["N", value]),
        return: () => notifications.push(["R"]),
        throw: (value) => notifications.push(["T", value]),
      }),
    );
    source.subscribe(subject);

    // Assert
    assertEquals(notifications, [["N", 5], ["R"]]);
  },
);

Deno.test("AsyncSubject should only emit the last value on return", () => {
  // Arrange
  const subject = new AsyncSubject<string>();
  const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];

  // Act
  subject.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );
  subject.next("foo");
  subject.next("bar");
  subject.return();

  // Assert
  assertEquals(notifications, [["N", "bar"], ["R"]]);
});

Deno.test("AsyncSubject should not emit if no value is nexted", () => {
  // Arrange
  const subject = new AsyncSubject<string>();
  const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];

  // Act
  subject.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );
  subject.return();

  // Assert
  assertEquals(notifications, [["R"]]);
});

Deno.test("AsyncSubject should emit last value to late subscribers", () => {
  // Arrange
  const subject = new AsyncSubject<string>();
  const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];

  // Act
  subject.next("foo");
  subject.next("bar");
  subject.return();
  subject.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );

  // Assert
  assertEquals(notifications, [["N", "bar"], ["R"]]);
});

Deno.test(
  "AsyncSubject should not emit to late subscribers if no value was nexted",
  () => {
    // Arrange
    const subject = new AsyncSubject<string>();
    const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];

    // Act
    subject.return();
    subject.subscribe(
      new Observer({
        next: (value) => notifications.push(["N", value]),
        return: () => notifications.push(["R"]),
        throw: (value) => notifications.push(["T", value]),
      }),
    );

    // Assert
    assertEquals(notifications, [["R"]]);
  },
);

Deno.test("AsyncSubject should not emit values until return", () => {
  // Arrange
  const subject = new AsyncSubject<string>();
  const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];
  subject.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );

  // Act
  subject.next("foo");
  subject.next("bar");

  // Assert
  assertEquals(notifications, []);
});

Deno.test("AsyncSubject should pass through this subject", () => {
  // Arrange
  const error = new Error("test error");
  const subject = new AsyncSubject<string>();
  const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];
  subject.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );

  // Act
  subject.next("foo");
  subject.throw(error);

  // Assert
  assertEquals(notifications, [["T", error]]);
});

Deno.test("AsyncSubject should notify late subscribers", () => {
  // Arrange
  const error = new Error("test error");
  const subject = new AsyncSubject<string>();
  const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];

  // Act
  subject.next("foo");
  subject.throw(error);
  subject.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );

  // Assert
  assertEquals(notifications, [["T", error]]);
});

Deno.test("AsyncSubject should pass through this subject", () => {
  // Arrange
  const subject = new AsyncSubject<string>();
  const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];
  subject.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );

  // Act
  subject.next("foo");
  subject.return();

  // Assert
  assertEquals(notifications, [["N", "foo"], ["R"]]);
});

Deno.test("AsyncSubject should notify late subscribers", () => {
  // Arrange
  const subject = new AsyncSubject<string>();
  const notifications: Array<["N", string] | ["R"] | ["T", unknown]> = [];

  // Act
  subject.next("foo");
  subject.return();
  subject.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );

  // Assert
  assertEquals(notifications, [["N", "foo"], ["R"]]);
});

Deno.test(
  "AsyncSubject should enforce the correct 'this' binding when calling instance methods",
  () => {
    // Arrange
    const subject = new AsyncSubject();
    assertThrows(
      () => subject.next.call(null, 1),
      TypeError,
      "'this' is not instanceof 'AsyncSubject'",
    );
    assertThrows(
      () => subject.return.call(null),
      TypeError,
      "'this' is not instanceof 'AsyncSubject'",
    );
    assertThrows(
      () => subject.throw.call(null, new Error("test")),
      TypeError,
      "'this' is not instanceof 'AsyncSubject'",
    );
    assertThrows(
      () => subject.subscribe.call(null, new Observer()),
      TypeError,
      "'this' is not instanceof 'AsyncSubject'",
    );
  },
);
