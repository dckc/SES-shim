import '../ses.js';
import './lockdown.js';
import tap from 'tap';

const { test } = tap;

// Array is a shared global
test('identity Array', t => {
  t.plan(7);

  const c1 = new Compartment();
  const c2 = new c1.globalThis.Compartment();

  t.equal(c1.evaluate('Array'), Array);
  t.equal(c1.evaluate('Array'), c1.evaluate('Array'));
  t.equal(c1.evaluate('Array'), c2.evaluate('Array'));
  t.equal(c1.evaluate('Array'), c2.evaluate('(0,eval)("Array")'));

  const a2 = c2.evaluate('[]');
  t.ok(a2 instanceof Array);
  t.ok(a2 instanceof c1.globalThis.Array);
  t.ok(a2 instanceof c2.globalThis.Array);
});

// Compartment is a shared global
test('identity Compartment', t => {
  t.plan(8);

  const c1 = new Compartment();
  const c2 = new c1.globalThis.Compartment();

  t.notEqual(c1.evaluate('Compartment'), Compartment);
  t.equal(c1.evaluate('Compartment'), c1.evaluate('Compartment'));
  t.notEqual(c1.evaluate('Compartment'), c2.evaluate('Compartment'));
  t.equal(c1.evaluate('Compartment'), c1.evaluate('(0,eval)("Compartment")'));
  t.notEqual(
    c1.evaluate('Compartment'),
    c2.evaluate('(0,eval)("Compartment")'),
  );

  const e3 = c2.evaluate('(new Compartment())');
  t.ok(e3 instanceof Compartment);
  t.ok(e3 instanceof c1.globalThis.Compartment);
  t.ok(e3 instanceof c2.globalThis.Compartment);

  t.end();
});

// eval is evaluator-specific
test('identity eval', t => {
  t.plan(8);

  const c1 = new Compartment();
  const c2 = new c1.globalThis.Compartment();

  t.ok(c2.evaluate('eval') instanceof Function);
  t.ok(c2.evaluate('eval') instanceof Object);
  t.ok(c2.evaluate('eval instanceof Function'));
  t.ok(c2.evaluate('eval instanceof Object'));
  t.ok(c2.evaluate('eval') instanceof c1.evaluate('Function'));
  t.ok(c2.evaluate('eval') instanceof c1.evaluate('Object'));

  // eslint-disable-next-line no-eval
  t.notEqual(c2.evaluate('eval'), eval);
  t.notEqual(c2.evaluate('eval'), c1.evaluate('eval'));
});

// Function is evaluator-specific
test('identity Function', t => {
  t.plan(11);

  const c1 = new Compartment();
  const c2 = new c1.globalThis.Compartment();
  const c3 = new c2.globalThis.Compartment();

  t.ok(c2.evaluate('Function') instanceof Function);
  t.ok(c2.evaluate('Function') instanceof Object);
  t.ok(c2.evaluate('Function instanceof Function'));
  t.ok(c2.evaluate('Function instanceof Object'));
  t.ok(c2.evaluate('Function') instanceof c1.evaluate('Function'));
  t.ok(c2.evaluate('Function') instanceof c1.evaluate('Object'));

  t.notEqual(c2.evaluate('Function'), Function);
  t.notEqual(c2.evaluate('Function'), c1.evaluate('Function'));

  const f2 = c2.evaluate('function x(a, b) { return a+b; }; x');
  t.ok(f2 instanceof c1.globalThis.Function);
  t.ok(f2 instanceof c2.globalThis.Function);
  t.ok(f2 instanceof c3.globalThis.Function);
});
