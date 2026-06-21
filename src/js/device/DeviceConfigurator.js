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
