import './install-ses-safe.js';
import tap from 'tap';

const { test } = tap;

test('reject HTML comment expressions in evaluate', t => {
  t.plan(6);

  const c = new Compartment();

  function wrap(s) {
    return `
      function name() {
        ${s};
        return a;
      }`;
  }

  const htmlOpenComment1 = `const a = foo <!-- hah\n('evil')`;
  const htmlCloseComment1 = `const a = foo --> hah\n('evil')`;
  const htmlOpenComment2 = `const a = eval <!-- hah\n('evil')`;
  const htmlCloseComment2 = `const a = eval --> hah\n('evil')`;
  const htmlOpenComment3 = `const a = import <!-- hah\n('evil')`;
  const htmlCloseComment3 = `const a = import --> hah\n('evil')`;

  t.throws(
    () => c.evaluate(wrap(htmlOpenComment1)),
    SyntaxError,
    'htmlOpenComment',
  );
  t.throws(
    () => c.evaluate(wrap(htmlCloseComment1)),
    SyntaxError,
    'htmlCloseComment',
  );

  t.throws(
    () => c.evaluate(wrap(htmlOpenComment2)),
    SyntaxError,
    'htmlOpenComment',
  );
  t.throws(
    () => c.evaluate(wrap(htmlCloseComment2)),
    SyntaxError,
    'htmlCloseComment',
  );

  t.throws(
    () => c.evaluate(wrap(htmlOpenComment3)),
    SyntaxError,
    'htmlOpenComment',
  );
  t.throws(
    () => c.evaluate(wrap(htmlCloseComment3)),
    SyntaxError,
    'htmlCloseComment',
  );
});

test('reject HTML comment expressions in Function', t => {
  t.plan(6);

  const c = new Compartment();

  function wrap(s) {
    return `new Function("${s}; return a;")`;
  }

  const htmlOpenComment1 = `const a = foo <!-- hah\n('evil')`;
  const htmlCloseComment1 = `const a = foo --> hah\n('evil')`;
  const htmlOpenComment2 = `const a = eval <!-- hah\n('evil')`;
  const htmlCloseComment2 = `const a = eval --> hah\n('evil')`;
  const htmlOpenComment3 = `const a = import <!-- hah\n('evil')`;
  const htmlCloseComment3 = `const a = import --> hah\n('evil')`;

  t.throws(
    () => c.evaluate(wrap(htmlOpenComment1)),
    SyntaxError,
    'htmlOpenComment',
  );
  t.throws(
    () => c.evaluate(wrap(htmlCloseComment1)),
    SyntaxError,
    'htmlCloseComment',
  );

  t.throws(
    () => c.evaluate(wrap(htmlOpenComment2)),
    SyntaxError,
    'htmlOpenComment',
  );
  t.throws(
    () => c.evaluate(wrap(htmlCloseComment2)),
    SyntaxError,
    'htmlCloseComment',
  );

  t.throws(
    () => c.evaluate(wrap(htmlOpenComment3)),
    SyntaxError,
    'htmlOpenComment',
  );
  t.throws(
    () => c.evaluate(wrap(htmlCloseComment3)),
    SyntaxError,
    'htmlCloseComment',
  );
});

test('reject HTML comment expressions with name', t => {
  t.plan(2);

  const c = new Compartment();
  const code = '<!-- -->';

  t.throws(
    () => c.evaluate(code),
    {
      name: 'SyntaxError',
      message: 'SES3: Possible HTML comment rejected at <unknown>:1',
    },
    'htmlCloseComment without name',
  );

  t.throws(
    () =>
      c.evaluate(code, {
        name: 'bogus://contrived',
      }),
    {
      name: 'SyntaxError',
      message: 'SES3: Possible HTML comment rejected at bogus://contrived:1',
    },
    'htmlCloseComment with name',
  );
});
