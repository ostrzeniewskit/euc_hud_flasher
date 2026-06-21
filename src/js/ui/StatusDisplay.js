export class StatusDisplay {
  #el;

  constructor(element) {
    this.#el = element;
  }

  show(msg, isError = false) {
    this.#el.textContent = msg;
    this.#el.className   = isError ? 'error' : '';
  }

  clear() {
    this.#el.textContent = '';
    this.#el.className   = '';
  }
}
