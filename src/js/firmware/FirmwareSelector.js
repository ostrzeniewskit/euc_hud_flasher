export class FirmwareSelector {
  #selectEl;
  #notesEl;
  #flashButtonEl;
  #loader;

  constructor(selectEl, notesEl, flashButtonEl, loader) {
    this.#selectEl      = selectEl;
    this.#notesEl       = notesEl;
    this.#flashButtonEl = flashButtonEl;
    this.#loader        = loader;
  }

  async init() {
    try {
      const versions = await this.#loader.load();
      this.#selectEl.innerHTML = '';
      for (const v of versions) {
        const opt         = document.createElement('option');
        opt.value         = v.version;
        opt.textContent   = `v${v.version}  (${v.date})`;
        opt.dataset.notes = v.notes || '';
        this.#selectEl.appendChild(opt);
      }
      this.#applySelection();
      this.#selectEl.addEventListener('change', () => this.#applySelection());
    } catch (e) {
      this.#selectEl.innerHTML = '<option disabled>Could not load versions</option>';
      console.error(e);
    }
  }

  #applySelection() {
    const opt = this.#selectEl.selectedOptions[0];
    if (!opt) return;
    this.#flashButtonEl.setAttribute('manifest', `firmware/${opt.value}/manifest.json`);
    this.#notesEl.textContent = opt.dataset.notes || '';
  }
}
