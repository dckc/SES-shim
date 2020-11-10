import '../ses.js';
import './lockdown.js';
import tap from 'tap';

const { test } = tap;

test('globalObject properties', t => {
  t.plan(10);

  const c = new Compartment();

  t.notEqual(c.globalThis, this);
  t.notEqual(c.globalThis, globalThis);
  t.equal(c.globalThis.globalThis, c.globalThis);

  t.equal(c.globalThis.Array, Array);
  t.equal(c.globalThis.Array, globalThis.Array);

  // eslint-disable-next-line no-eval
  t.notEqual(c.globalThis.eval, eval);
  t.notEqual(c.globalThis.eval, globalThis.eval);

  t.notEqual(c.globalThis.Function, Function);
  t.notEqual(c.globalThis.Function, globalThis.Function);

  t.notEqual(c.globalThis.Compartment, Compartment);
});
