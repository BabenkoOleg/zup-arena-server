class Base {
  constructor(data, options) {
    this.data = data;
    this.options = options;
    this.mode = Array.isArray(this.data) ? 'Collection' : 'Document';
  }

  asJson() {
    return this[`serialize${this.mode}`](this.data, this.options);
  }

  serializeCollection() {
    throw new Error('Not implemented');
  }

  serializeDocument() {
    throw new Error('Not implemented');
  }
}

module.exports = Base;
