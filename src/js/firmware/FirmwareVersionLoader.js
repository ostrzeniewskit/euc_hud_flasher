const VERSIONS_URL = 'firmware/versions.json';

export class FirmwareVersionLoader {
  #url;

  constructor(url = VERSIONS_URL) {
    this.#url = url;
  }

  async load() {
    const resp = await fetch(this.#url);
    if (!resp.ok) throw new Error(`Failed to fetch ${this.#url} (${resp.status})`);
    return resp.json();
  }
}
