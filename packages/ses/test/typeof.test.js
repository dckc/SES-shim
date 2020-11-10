import './install-ses-safe.js';
import tap from 'tap';

const { test } = tap;

test('typeof', t => {
  t.plan(8);

  const c = new Compartment();

  t.throws(() => c.evaluate('DEFINITELY_NOT_DEFINED'), ReferenceError);
  t.equal(c.evaluate('typeof DEFINITELY_NOT_DEFINED'), 'undefined');

  t.equal(c.evaluate('typeof 4'), 'number');
  t.equal(c.evaluate('typeof undefined'), 'undefined');
  t.equal(c.evaluate('typeof "a string"'), 'string');

  // TODO: the Compartment currently censors objects from the unsafe global, but
  // they appear defined as 'undefined' and don't throw a ReferenceError.
  // https://github.com/Agoric/SES-shim/issues/309
  t.doesNotThrow(() => c.evaluate('global'), ReferenceError);
  t.equal(c.evaluate('global'), undefined);
  t.equal(c.evaluate('typeof global'), 'undefined');
});
