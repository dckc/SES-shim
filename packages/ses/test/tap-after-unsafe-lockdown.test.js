import '../ses.js';
import './lockdown-unsafe.js';
import tap from 'tap';

// Confirm that tap can be imported after an unsafe-Error lockdown, and
// exercise enough of tap to make sure the success cases still work.
// Unfortunately we can't exercise the failure cases (e.g. `t.equal(1, 2)`)
// without causing the SES test suite to fail, and it is the failure cases
// that are the most interesting. Many of the problems listed in bug #367 are
// triggered when a tap assertion fails, and tap attempts to display the
// stack trace of the failing assertion call. We can, however, at least
// provoke Error and err.stack, which provides *some* coverage.

function boom() {
  throw Error('kaboom');
}

tap.test('tap-after-unsafe-lockdown basic test works', t => {
  t.equal(1, 1);
  // boom();
  t.throws(() => boom(), /kaboom/);
  try {
    boom();
  } catch (e) {
    // eslint-disable-next-line no-unused-vars
    const frames = e.stack;
  }
  t.end();
});
