# Firmware releases

Place new firmware versions in a subfolder named after the version number, e.g.:

```
firmware/
  1.0.0/
    bootloader.bin
    partitions.bin
    firmware.bin
  1.1.0/
    bootloader.bin
    partitions.bin
    firmware.bin
```

After adding a new version, update `manifest.json` in the repo root to point to the new binary paths.
