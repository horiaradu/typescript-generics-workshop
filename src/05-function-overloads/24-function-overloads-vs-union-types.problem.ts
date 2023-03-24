import { expect, it } from 'vitest';
import { Equal, Expect } from '../helpers/type-utils';

type Generator<R> = () => R;

// function runGenerator<R>(generator: { run: Generator<R> }): R;
// function runGenerator<R>(generator: Generator<R>): R;
function runGenerator<R>(generator: Generator<R> | { run: Generator<R> }): R {
  if (typeof generator === 'function') {
    return generator();
  }
  return generator.run();
}

it('Should accept an object where the generator is a function', () => {
  const result = runGenerator({
    run: () => 'hello',
  });

  expect(result).toBe('hello');

  type test1 = Expect<Equal<typeof result, string>>;
});

it('Should accept an object where the generator is a function', () => {
  const result = runGenerator(() => 'hello');

  expect(result).toBe('hello');

  type test1 = Expect<Equal<typeof result, string>>;
});
