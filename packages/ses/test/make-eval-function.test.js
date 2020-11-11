import '../ses.js';
import './lockdown.js';
import tap from 'tap';
import { makeEvalFunction } from '../src/make-eval-function.js';

const { test } = tap;

test('makeEvalFunction - leak', t => {
  t.plan(8);

  const globalObject = {};
  const safeEval = makeEvalFunction(globalObject);

  t.throws(() => safeEval('none'), ReferenceError);
  t.equal(safeEval('this.none'), undefined);

  globalThis.none = 5;

  t.equal(safeEval('none'), undefined);
  t.equal(safeEval('this.none'), undefined);

  safeEval('none = 8');

  t.equal(safeEval('none'), 8);
  t.equal(safeEval('this.none'), 8);

  safeEval('this.none = 11');

  t.equal(safeEval('none'), 11);
  t.equal(safeEval('this.none'), 11);
});

test('makeEvalFunction - globals', t => {
  t.plan(20);

  const globalObject = Object.create(
    {},
    {
      foo: { value: 1 },
      bar: { value: 2, writable: true },
    },
  );
  const safeEval = makeEvalFunction(globalObject);

  t.equal(safeEval('foo'), 1);
  t.equal(safeEval('bar'), 2);
  t.equal(safeEval('this.foo'), 1);
  t.equal(safeEval('this.bar'), 2);

  t.throws(() => {
    globalObject.foo = 3;
  }, TypeError);
  t.doesNotThrow(() => {
    globalObject.bar = 4;
  });

  t.equal(safeEval('foo'), 1);
  t.equal(safeEval('bar'), 4);
  t.equal(safeEval('this.foo'), 1);
  t.equal(safeEval('this.bar'), 4);

  t.throws(() => safeEval('foo = 6'), TypeError);
  safeEval('bar = 7');

  t.equal(safeEval('foo'), 1);
  t.equal(safeEval('bar'), 7);
  t.equal(safeEval('this.foo'), 1);
  t.equal(safeEval('this.bar'), 7);

  t.throws(() => safeEval('foo = 9'), TypeError);
  safeEval('this.bar = 10');

  t.equal(safeEval('foo'), 1);
  t.equal(safeEval('bar'), 10);
  t.equal(safeEval('this.foo'), 1);
  t.equal(safeEval('this.bar'), 10);
});
