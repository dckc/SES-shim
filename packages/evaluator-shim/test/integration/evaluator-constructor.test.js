import tap from 'tap';
import sinon from 'sinon';
import Evaluator from '../../src/main.js';
import stubFunctionConstructors from '../stubFunctionConstructors.js';

const { test } = tap;

test('Evaluator class', t => {
  t.plan(8);

  // Mimic repairFunctions.
  stubFunctionConstructors(sinon);

  t.equals(typeof Evaluator, 'function', 'typeof');
  t.ok(Evaluator instanceof Function, 'instanceof');
  t.equals(Evaluator.name, 'Evaluator', 'Constructor "name" property');

  t.equals(Evaluator.toString(), 'function Evaluator() { [shim code] }');
  t.equals(
    Evaluator[Symbol.toStringTag],
    undefined,
    '"Symbol.toStringTag" property',
  );

  t.deepEqual(
    Reflect.ownKeys(Evaluator).sort(),
    ['length', 'name', 'prototype', 'toString'].sort(),
    'static properties',
  );

  t.throws(
    () => Evaluator(),
    TypeError,
    'Evaluator must not support the [[Call]] method',
  );
  t.doesNotThrow(
    () => new Evaluator(),
    TypeError,
    'Evaluator must support the [[Construct]] method',
  );

  sinon.restore();
});
