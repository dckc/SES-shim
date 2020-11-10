import './install-ses-safe.js';
import tap from 'tap';

const { test } = tap;

test('Compartment instance', t => {
  t.plan(9);

  const c = new Compartment();

  t.equals(typeof c, 'object', 'typeof');
  t.ok(c instanceof Compartment, 'instanceof');
  t.notEquals(
    c.constructor,
    Compartment,
    'function Compartment() { [native code] }',
  );

  t.equals(
    Object.getPrototypeOf(c),
    Compartment.prototype,
    'Object.getPrototypeOf()',
  );
  t.ok(
    // eslint-disable-next-line no-prototype-builtins
    Compartment.prototype.isPrototypeOf(c),
    'Compartment.prototype.isPrototypeOf()',
  );

  t.equals(c.toString(), '[object Compartment]', 'toString()');
  t.equals(c[Symbol.toStringTag], undefined, '"Symbol.toStringTag" property');

  t.deepEqual(Reflect.ownKeys(c), [], 'static properties');
  t.deepEqual(
    Reflect.ownKeys(Object.getPrototypeOf(c)).sort(),
    [
      'constructor',
      'evaluate',
      'import',
      'importNow',
      'load',
      'module',
      'name',
      'globalThis',
      'toString',
    ].sort(),
    'prototype properties',
  );
});
