const CMD_TIMEOUT_MS = 2000;

export class DeviceConfigurator {
  #connection;

  constructor(connection) {
    this.#connection = connection;
  }

  async readName() {
    const resp = await this.#sendCommand('NAME?', 'NAME=');
    return resp ? resp.substring(5) : null;
  }

  async setName(name) {
    const resp = await this.#sendCommand(`NAME=${name}`, 'OK:NAME=');
    return resp ? resp.substring(3) : null;
  }

  async readMapping() {
    const resp = await this.#sendCommand('MAPPING?', 'MAPPING=');
    return resp ? resp.substring(8) : null;
  }

  async setMapping(value) {
    const resp = await this.#sendCommand(`MAPPING=${value}`, 'OK:MAPPING=');
    return resp ? resp.substring(3) : null;
  }

  async readMode() {
    const resp = await this.#sendCommand('MODE?', 'MODE=');
    return resp ? resp.substring(5) : null;
  }

  async setMode(mode) {
    const resp = await this.#sendCommand(`MODE=${mode}`, 'OK:MODE=');
    return resp ? resp.substring(3) : null;
  }

  async readBattery() {
    const resp = await this.#sendCommand('BATTERY?', 'BATTERY=');
    return resp ? resp.substring(8) : null;
  }

  async setBattery(value) {
    const resp = await this.#sendCommand(`BATTERY=${value}`, 'OK:BATTERY=');
    return resp ? resp.substring(3) : null;
  }

  async readFlip() {
    const resp = await this.#sendCommand('FLIP?', 'FLIP=');
    return resp ? resp.substring(5) : null;
  }

  async setFlip(value) {
    const resp = await this.#sendCommand(`FLIP=${value}`, 'OK:FLIP=');
    return resp ? resp.substring(3) : null;
  }

  async #sendCommand(cmd, expectPrefix, timeoutMs = CMD_TIMEOUT_MS) {
    await this.#connection.writeLine(cmd);
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const line = await this.#connection.readLine(deadline - Date.now());
      if (line?.startsWith(expectPrefix)) return line;
    }
    return null;
  }
}
