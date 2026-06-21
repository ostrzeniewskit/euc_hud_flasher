export class ConfiguratorUI {
  #connection;
  #configurator;
  #status;

  #connectBtn;
  #disconnectBtn;
  #readBtn;
  #setBtn;
  #nameInput;
  #mappingSelect;
  #readMappingBtn;
  #setMappingBtn;
  #readModeBtn;
  #setModeBtn;
  #modeRadios;

  constructor(connection, configurator, status) {
    this.#connection    = connection;
    this.#configurator  = configurator;
    this.#status        = status;

    this.#connectBtn     = document.getElementById('connectBtn');
    this.#disconnectBtn  = document.getElementById('disconnectBtn');
    this.#readBtn        = document.getElementById('readBtn');
    this.#setBtn         = document.getElementById('setBtn');
    this.#nameInput      = document.getElementById('deviceName');
    this.#mappingSelect  = document.getElementById('mappingSelect');
    this.#readMappingBtn = document.getElementById('readMappingBtn');
    this.#setMappingBtn  = document.getElementById('setMappingBtn');
    this.#readModeBtn    = document.getElementById('readModeBtn');
    this.#setModeBtn     = document.getElementById('setModeBtn');
    this.#modeRadios     = document.querySelectorAll('input[name="dispMode"]');

    this.#setupListeners();
  }

  #setupListeners() {
    this.#connectBtn.addEventListener('click',     () => this.#onConnect());
    this.#disconnectBtn.addEventListener('click',  () => this.#onDisconnect());
    this.#readBtn.addEventListener('click',        () => this.#onReadName());
    this.#setBtn.addEventListener('click',         () => this.#onSetName());
    this.#readMappingBtn.addEventListener('click', () => this.#onReadMapping());
    this.#setMappingBtn.addEventListener('click',  () => this.#onSetMapping());
    this.#readModeBtn.addEventListener('click',    () => this.#onReadMode());
    this.#setModeBtn.addEventListener('click',     () => this.#onSetMode());
  }

  #setConnected(on) {
    this.#connectBtn.disabled     = on;
    this.#disconnectBtn.disabled  = !on;
    this.#readBtn.disabled        = !on;
    this.#setBtn.disabled         = !on;
    this.#nameInput.disabled      = !on;
    this.#mappingSelect.disabled  = !on;
    this.#readMappingBtn.disabled = !on;
    this.#setMappingBtn.disabled  = !on;
    this.#readModeBtn.disabled    = !on;
    this.#setModeBtn.disabled     = !on;
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

  async #onReadName() {
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

  async #onSetName() {
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

  async #onReadMapping() {
    this.#status.show('Reading mapping...');
    try {
      const val = await this.#configurator.readMapping();
      if (val !== null) {
        this.#mappingSelect.value = val;
        this.#status.show('Current mapping: ' + val);
      } else {
        this.#status.show('No response from device.', true);
      }
    } catch (e) {
      this.#status.show('Read failed: ' + e.message, true);
    }
  }

  async #onSetMapping() {
    const val = this.#mappingSelect.value;
    this.#status.show('Saving mapping...');
    try {
      const saved = await this.#configurator.setMapping(val);
      if (saved !== null) {
        this.#status.show('Saved: ' + saved);
      } else {
        this.#status.show('No response from device.', true);
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
