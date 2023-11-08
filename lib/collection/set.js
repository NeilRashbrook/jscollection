import { Collection } from "../api.js"

/**
 * A `Collection` which can hold each object only once.
 * Properties:
 * - not ordered
 * - can *not* hold the same item several times
 * - fast
 */
export class SetColl extends Collection {
  constructor() {
    super();
    this._set = new Set();
  }

  /**
   * Adds this item.
   * If the item already exists, this is a no-op.
   * @param item {Object}
   */
  add(item) {
    var added = this._addWithoutObserver(item);
    if (added) {
      this._notifyAdded([item]);
    }
  }

  _addWithoutObserver(item) {
    if (this.contains(item)) {
      return false;
    }
    this._set.add(item);
    return true;
  }

  delete(item) {
    this.remove(item);
  }

  remove(item) {
    if (this._removeWithoutObserver(item)) {
      this._notifyRemoved([item]);
    }
  }

  _removeWithoutObserver(item) {
    return this._set.delete(item);
  }

  addAll(items) {
    items = items.filter(item => this._addWithoutObserver(item));
    if (items.length) {
      this._notifyAdded(items);
    }
  }

  removeAll(items) {
    items = items.filter(item => this._removeWithoutObserver(item));
    if (items.length) {
      this._notifyRemoved(items);
    }
  }

  clear() {
    if (this._set.size) {
      let items = this.contents;
      this._set.clear();
      this._notifyRemoved(items);
    }
  }

  get length() {
    return this._set.size;
  }

  get size() {
    return this._set.size;
  }

  contains(item) {
    return this._set.has(item);
  }

  has(item) {
    return this._set.has(item);
  }

  [Symbol.iterator]() {
    return this._set.values();
  }

  values() {
    return this._set.values();
  }

  keys() {
    return this._set.keys();
  }

  entries() {
    return this._set.entries();
  }

  forEach(func) {
    this._set.forEach(value => func(value, value, this));
  }

  get contents() {
    return [...this._set.values()];
  }

  /** This doesn't make much sense for SetColl. */
  get first() {
    return this.contents[0];
  }

  /** This doesn't make much sense for SetColl. Slow. */
  getIndex(i) {
    return this.contents[i];
  }

  /** This doesn't make much sense for SetColl. */
  getIndexRange(i, length) {
    if (!length) {
      return [];
    }
    return this.contents.slice(i, i + length);
  }

  /*
  iterator*() {
    this._map.forEach(value => yield value[i]);
  }*/
}
