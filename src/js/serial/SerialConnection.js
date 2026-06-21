const BAUD_RATE = 115200;

export class SerialConnection {
  #port   = null;
  #reader = null;
  #writer = null;

  get isConnected() { return this.#port !== null; }

  async connect() {
    this.#port   = await navigator.serial.requestPort();
    await this.#port.open({ baudRate: BAUD_RATE });
    this.#writer = this.#port.writable.getWriter();
    this.#reader = this.#port.readable.getReader();
  }

  async disconnect() {
    if (this.#reader) { await this.#reader.cancel(); this.#reader.releaseLock(); this.#reader = null; }
    if (this.#writer) { this.#writer.releaseLock(); this.#writer = null; }
    if (this.#port)   { await this.#port.close();   this.#port   = null; }
  }

  async writeLine(text) {
    await this.#writer.write(new TextEncoder().encode(text + '\n'));
  }

  async readLine(timeoutMs = 2000) {
    const decoder  = new TextDecoder();
    let buf        = '';
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      try {
        const result = await Promise.race([
          this.#reader.read(),
          new Promise(r => setTimeout(() => r({ timeout: true }), remaining))
        ]);
        if (result.timeout || result.done) break;
        buf += decoder.decode(result.value);
        const nl = buf.indexOf('\n');
        if (nl !== -1) return buf.substring(0, nl).trim();
      } catch { break; }
    }
    return buf.trim();
  }
}
