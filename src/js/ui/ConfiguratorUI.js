export class ConfiguratorUI {
  #connection;
  #configurator;
  #status;

  #connectBtn;
  #disconnectBtn;
  #readBtn;
  #setBtn;
  #nameInput;
  #readModeBtn;
  #setModeBtn;
  #modeRadios;

  constructor(connection, configurator, status) {
    this.#connection    = connection;
    this.#configurator  = configurator;
    this.#status        = status;

    this.#connectBtn    = document.getElementById('connectBtn');
    this.#disconnectBtn = document.getElementById('disconnectBtn');
    this.#readBtn       = document.getElementById('readBtn');
    this.#setBtn        = document.getElementById('setBtn');
    this.#nameInput     = document.getElementById('deviceName');
    this.#readModeBtn   = document.getElementById('readModeBtn');
    this.#setModeBtn    = document.getElementById('setModeBtn');
    this.#modeRadios    = document.querySelectorAll('input[name="dispMode"]');

    this.#setupListeners();
  }

  #setupListeners() {
    this.#connectBtn.addEventListener('click',    () => this.#onConnect());
    this.#disconnectBtn.addEventListener('click', () => this.#onDisconnect());
    this.#readBtn.addEventListener('click',       () => this.#onRead());
    this.#setBtn.addEventListener('click',        () => this.#onSet());
    this.#readModeBtn.addEventListener('click',   () => this.#onReadMode());
    this.#setModeBtn.addEventListener('click',    () => this.#onSetMode());
  }

  #setConnected(on) {
    this.#connectBtn.disabled    = on;
    this.#disconnectBtn.disabled = !on;
    this.#readBtn.disabled       = !on;
    this.#setBtn.disabled        = !on;
    this.#nameInput.disabled     = !on;
    this.#readModeBtn.disabled   = !on;
    this.#setModeBtn.disabled    = !on;
    this.#modeRadios.forEach(r => r.disabled = !on);
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

  async #onReadMode() {
    this.#status.show('Reading mode...');
    try {
      const mode = await this.#configurator.readMode();
      if (mode !== null) {
        this.#modeRadios.forEach(r => r.checked = (r.value === mode));
        this.#status.show('Current mode: ' + mode);
      } else {
        this.#status.show('No response from device.', true);
      }
    } catch (e) {
      this.#status.show('Read failed: ' + e.message, true);
    }
  }

  async #onSetMode() {
    const mode = document.querySelector('input[name="dispMode"]:checked').value;
    this.#status.show('Saving mode...');
    try {
      const saved = await this.#configurator.setMode(mode);
      if (saved !== null) {
        this.#status.show('Saved: ' + saved);
      } else {
        this.#status.show('No response from device.', true);
      }
    } catch (e) {
      this.#status.show('Save failed: ' + e.message, true);
    }
  }
}
