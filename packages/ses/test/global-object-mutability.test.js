import './install-ses-safe.js';
import tap from 'tap';
import '../lockdown.js';

const { test } = tap;

test('globalObject properties mutable', t => {
  t.plan(3);

  const c = new Compartment();

  c.evaluate('Date = function() { return "bogus" }');
  t.equal(c.evaluate('Date()'), 'bogus');

  c.evaluate('Compartment = function(opts) { this.extra = "extra" }');
  t.equal(c.evaluate('(new Compartment({})).extra'), 'extra');

  c.evaluate('Function = function() { this.extra = "extra" }');
  t.equal(c.evaluate('new Function().extra'), 'extra');
});

test('globalObject properties immutable', t => {
  t.plan(6);

  const c = new Compartment();

  t.throws(() => c.evaluate('Infinity = 4'), TypeError); // strict mode
  t.equal(c.evaluate('Infinity'), Infinity);

  t.throws(() => c.evaluate('NaN = 4'), TypeError);
  t.notEqual(c.evaluate('NaN'), 4);

  t.throws(() => c.evaluate('undefined = 4'), TypeError);
  t.equal(c.evaluate('undefined'), undefined);
});
