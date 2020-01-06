import { createGlobalObject } from './globalObject.js';
import { performEval } from './evaluate.js';
import { getCurrentRealmRec } from './realmRec.js';

/**
 * Evaluator()
 * The Evaluator constructor is a global. A host that wants to execute
 * code in a context bound to a new global creates a new evaluator.
 */
const privateFields = new WeakMap();
export default class Evaluator {
  constructor(options = {}) {
    // Extract options, and shallow-clone transforms.
    const { transforms = [] } = options;
    const globalTransforms = [...transforms];

    const realmRec = getCurrentRealmRec();
    const globalObject = createGlobalObject(realmRec, {
      globalTransforms,
    });

    privateFields.set(this, {
      globalTransforms,
      globalObject,
    });
  }

  get global() {
    return privateFields.get(this).globalObject;
  }

  /**
   * The options are:
   * "x": the source text of a program to execute.
   * "endowments": a dictionary of globals to make available in the evaluator.
   */
  evaluate(x, endowments = {}, options = {}) {
    // Perform this check first to avoid unecessary sanitizing.
    if (typeof x !== 'string') {
      throw new TypeError('first argument of evaluate() must be a string');
    }

    // Extract options, and shallow-clone transforms.
    const { transforms = [], sloppyGlobalsMode = false } = options;
    const localTransforms = [...transforms];

    const { globalTransforms, globalObject } = privateFields.get(this);
    const realmRec = getCurrentRealmRec();
    return performEval(realmRec, x, globalObject, endowments, {
      globalTransforms,
      localTransforms,
      sloppyGlobalsMode,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  toString() {
    return '[object Evaluator]';
  }

  static toString() {
    return 'function Evaluator() { [shim code] }';
  }
}
