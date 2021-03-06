// @ts-check
/* eslint no-bitwise: ["off"] */

const q = JSON.stringify;

const privateFields = new WeakMap();

export class BufferReader {
  /**
   * @param {ArrayBuffer} buffer
   */
  constructor(buffer) {
    const data = new Uint8Array(buffer);
    privateFields.set(this, {
      data,
      length: data.length,
      index: 0,
      offset: 0
    });
  }

  /**
   * @return {number}
   */
  get length() {
    return privateFields.get(this).length;
  }

  /**
   * @return {number}
   */
  get index() {
    return privateFields.get(this).index;
  }

  /**
   * @param {number} index
   */
  set index(index) {
    this.seek(index);
  }

  /**
   * @param {number} offset
   */
  set offset(offset) {
    const fields = privateFields.get(this);
    if (offset > fields.data.length) {
      throw new Error(`Cannot set offset beyond length of underlying data`);
    }
    if (offset < 0) {
      throw new Error(`Cannot set negative offset`);
    }
    fields.offset = offset;
    fields.length = fields.data.length - fields.offset;
  }

  /**
   * @param {number} index
   * @return {boolean} whether the read head can move to the given absolute
   * index.
   */
  canSeek(index) {
    const fields = privateFields.get(this);
    return index >= 0 && fields.offset + index <= fields.length;
  }

  /**
   * @param {number} index the index to check.
   * @throws {Error} an Error if the index is out of bounds.
   */
  assertCanSeek(index) {
    const fields = privateFields.get(this);
    if (!this.canSeek(index)) {
      throw new Error(
        `End of data reached (data length = ${fields.length}, asked index ${index}`
      );
    }
  }

  /**
   * @param {number} index
   * @return {number} prior index
   */
  seek(index) {
    const fields = privateFields.get(this);
    const restore = fields.index;
    this.assertCanSeek(index);
    fields.index = index;
    return restore;
  }

  /**
   * @param {number} size
   * @returns {Uint8Array}
   */
  peek(size) {
    const fields = privateFields.get(this);
    // Clamp size.
    size = Math.max(0, Math.min(fields.length - fields.index, size));
    if (size === 0) {
      // in IE10, when using subarray(idx, idx), we get the array [0x00] instead of [].
      return new Uint8Array(0);
    }
    const result = fields.data.subarray(
      fields.offset + fields.index,
      fields.offset + fields.index + size
    );
    return result;
  }

  /**
   * @param {number} offset
   */
  canRead(offset) {
    const fields = privateFields.get(this);
    return this.canSeek(fields.index + offset);
  }

  /**
   * Check that the offset will not go too far.
   * @param {number} offset the additional offset to check.
   * @throws {Error} an Error if the offset is out of bounds.
   */
  assertCanRead(offset) {
    const fields = privateFields.get(this);
    this.assertCanSeek(fields.index + offset);
  }

  /**
   * Get raw data without conversion, <size> bytes.
   * @param {number} size the number of bytes to read.
   * @return {Uint8Array} the raw data.
   */
  read(size) {
    const fields = privateFields.get(this);
    this.assertCanRead(size);
    const result = this.peek(size);
    fields.index += size;
    return result;
  }

  /**
   * @returns {number}
   */
  readUint8() {
    const fields = privateFields.get(this);
    this.assertCanRead(1);
    const value = fields.data[fields.offset + fields.index];
    fields.index += 1;
    return value;
  }

  /**
   * @returns {number}
   */
  readUint16LE() {
    const fields = privateFields.get(this);
    this.assertCanRead(2);
    const index = fields.offset + fields.index;
    const a = fields.data[index + 0];
    const b = fields.data[index + 1];
    const value = (b << 8) | a;
    fields.index += 2;
    return value;
  }

  /**
   * @returns {number}
   */
  readUint32LE() {
    const fields = privateFields.get(this);
    this.assertCanRead(4);
    const index = fields.offset + fields.index;
    const a = fields.data[index + 0];
    const b = fields.data[index + 1];
    const c = fields.data[index + 2];
    const d = fields.data[index + 3];
    const value = ((d << 24) >>> 0) + ((c << 16) | (b << 8) | a);
    fields.index += 4;
    return value;
  }

  /**
   * @param {number} index
   * @returns {number}
   */
  byteAt(index) {
    const fields = privateFields.get(this);
    return fields.data[fields.offset + index];
  }

  /**
   * @param {number} offset
   */
  skip(offset) {
    const fields = privateFields.get(this);
    this.seek(fields.index + offset);
  }

  /**
   * @param {Uint8Array} expected
   * @returns {boolean}
   */
  expect(expected) {
    const fields = privateFields.get(this);
    if (!this.matchAt(fields.index, expected)) {
      return false;
    }
    fields.index += expected.length;
    return true;
  }

  /**
   * @param {number} index
   * @param {Uint8Array} expected
   * @returns {boolean}
   */
  matchAt(index, expected) {
    const fields = privateFields.get(this);
    if (index + expected.length > fields.length || index < 0) {
      return false;
    }
    for (let i = 0; i < expected.length; i += 1) {
      if (expected[i] !== this.byteAt(index + i)) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {Uint8Array} expected
   */
  assert(expected) {
    const fields = privateFields.get(this);
    if (!this.expect(expected)) {
      throw new Error(
        `Expected ${q(expected)} at ${fields.index}, got ${this.peek(
          expected.length
        )}`
      );
    }
  }

  /**
   * @param {Uint8Array} expected
   * @returns {number}
   */
  findLast(expected) {
    const fields = privateFields.get(this);
    let index = fields.length - expected.length;
    while (index >= 0 && !this.matchAt(index, expected)) {
      index -= 1;
    }
    return index;
  }
}
