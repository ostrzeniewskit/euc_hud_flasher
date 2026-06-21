export class ConfiguratorUI {
  #connection;
  #configurator;
  #status;

  #connectBtn;
  #disconnectBtn;
  #readBtn;
  #setBtn;
  #nameInput;

  constructor(connection, configurator, status) {
    this.#connection    = connection;
    this.#configurator  = configurator;
    this.#status        = status;

    this.#connectBtn    = document.getElementById('connectBtn');
    this.#disconnectBtn = document.getElementById('disconnectBtn');
    this.#readBtn       = document.getElementById('readBtn');
    this.#setBtn        = document.getElementById('setBtn');
    this.#nameInput     = document.getElementById('deviceName');

    this.#setupListeners();
  }

  #setupListeners() {
    this.#connectBtn.addEventListener('click',    () => this.#onConnect());
    this.#disconnectBtn.addEventListener('click', () => this.#onDisconnect());
    this.#readBtn.addEventListener('click',       () => this.#onRead());
    this.#setBtn.addEventListener('click',        () => this.#onSet());
  }

  #setConnected(on) {
    this.#connectBtn.disabled    = on;
    this.#disconnectBtn.disabled = !on;
    this.#readBtn.disabled       = !on;
    this.#setBtn.disabled        = !on;
    this.#nameInput.disabled     = !on;
  }

  async #onConnect() {
    try {
      await this.#connection.connect();
      this.#setConnected(true);
      this.#status.show('Connected. You can now read or set the device name.');
    } catch (e) {
      this.#status.show('Connection failed: ' + e.message, true);
    }
  }

  async #onDisconnect() {
    try { await this.#connection.disconnect(); } catch {}
    this.#setConnected(false);
    this.#status.show('Disconnected.');
  }

  async #onRead() {
    this.#status.show('Reading...');
    try {
      const name = await this.#configurator.readName();
      if (name !== null) {
        this.#nameInput.value = name;
        this.#status.show('Current name: ' + name);
      } else {
        this.#status.show('No response from device. Make sure firmware is running.', true);
      }
    } catch (e) {
      this.#status.show('Read failed: ' + e.message, true);
    }
  }

  async #onSet() {
    const name = this.#nameInput.value.trim();
    if (!name) { this.#status.show('Name cannot be empty.', true); return; }
    this.#status.show('Saving...');
    try {
      const saved = await this.#configurator.setName(name);
      if (saved !== null) {
        this.#status.show('Saved: ' + saved);
      } else {
        this.#status.show('No response from device. Make sure firmware is running.', true);
      }
    } catch (e) {
      this.#status.show('Save failed: ' + e.message, true);
    }
  }
}
