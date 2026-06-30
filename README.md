# EUC HUD Flasher

Flasher available  under
https://ostrzeniewskit.github.io/euc_hud_flasher/

Web-based firmware flasher and configurator for the **EUC HUD** — an ESP32-C3 optics HUD device.

This tool is the companion flasher for the [EUC-HUD-Optics-Configurator](https://github.com/ostrzeniewskit/EUC-HUD-Optics-Configurator) project.

## What the HUD displays

The HUD projects a heads-up display visible through the optics while riding.

**While riding** (wheel is moving), the display shows the active mode:

| Mode | What is shown |
|------|--------------|
| **Speed** | Current speed in km/h |
| **Safety Margin** | Safety margin as a percentage (0–100 %) — sourced from the EUC World app |

**While idle** (wheel is stationary or below the minimum speed threshold), the display automatically switches to a summary view showing:
- Battery level (%)
- Current trip distance — shown in km, or in m if under 1 km

This lets you glance at range and battery at a standstill without changing any setting.

On startup the HUD shows a scanning animation while it connects to the EUC World app over BLE. Once connected it switches to the selected live data view.

## What is configurable

All settings are written to the device over USB using the flasher and persist across power cycles:

| Setting | Description | Default |
|---------|-------------|---------|
| **BLE device name prefix** | The Bluetooth name the HUD scans for. Must match the name shown in EUC World on your phone. Use `EUC World` to pair with any instance, or `EUC World 123456` to target a specific device. | `EUC World` |
| **Display mode** | What value is shown while riding — Speed (km/h) or Safety Margin (%) from EUC World. | Speed |

## What it does

- Flashes firmware to the ESP32-C3 HUD device directly from the browser via USB (Web Serial API)
- Lets you read and set the BLE device name prefix so the HUD pairs with the correct EUC World app instance
- Lets you switch the display mode between Speed and Safety Margin

## Requirements

- Chrome or Edge on desktop (Web Serial API required)
- ESP32-C3 HUD connected via USB

## Usage

1. Open the [flasher](https://ostrzeniewskit.github.io/euc_hud_flasher/) in Chrome or Edge and connect the HUD via USB
2. **Flash Firmware** — select the firmware version from the dropdown and click "Install Firmware"
3. **Configure BLE name** — click "Connect", then read or set the device name prefix
   - `EUC World` pairs with any EUC World instance on any phone
   - `EUC World 123456` targets a specific phone (use the name shown in the EUC World app)
4. **Set display mode** — choose Speed (km/h) or Safety Margin (%) and click "Save to Device"

## Firmware files

| File | Flash offset | Description |
|------|-------------|-------------|
| `bootloader.bin` | `0x0000` | ESP32-C3 bootloader |
| `partitions.bin` | `0x8000` | Partition table |
| `firmware.bin` | `0x10000` | Application firmware |

New firmware releases are placed in the [`firmware/`](firmware/) folder.

## Updating firmware

To release a new firmware version:

1. Build the new binaries (bootloader, partitions, firmware)
2. Place them in the `firmware/<version>/` subfolder (e.g. `firmware/1.1.0/`)
3. Update `manifest.json` to point to the new binary paths
4. Copy or symlink the files to the repo root if needed for the current live release

## License

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — free to use and adapt with attribution, non-commercial only. See [LICENSE](LICENSE).

---

## Gallery

### Hardware

| | |
|---|---|
| ![HUD housing — mirror side](img/507d341f-beb5-46a9-a73d-81c773cd20b4.jpg) | ![HUD housing — lens side](img/7c0b4528-50fd-4998-94e8-adb172790d93.jpg) |
| 3D-printed housing — mirror & display side | 3D-printed housing — lens side with USB-C port |

### HUD in action

![HUD scanning for EUC World next to the wheel](img/32b485f3-ea30-4a95-97a9-7dfa349596f3.jpg)

| | |
|---|---|
| ![Rider POV — battery 100%, 6 min](img/93260336-16ad-423c-8f13-27e73b8a6c8f.jpg) | ![Rider POV — speed display](img/5e49a884-e688-4314-a0a5-63532e7283eb.jpg) |
| Rider POV — battery & range | Rider POV — speed |

### Demo

![HUD boot with flasher UI in background](img/ezgif-657bafa9177df4a4.gif)

*HUD scanning for BLE — device name set via the flasher*

![HUD scanning with custom device name](img/ezgif-6e00b60d87dd4760.gif)

*Custom device name ("Nosfet aero") configured through the flasher*


*Help me support my project!*
https://buymeacoffee.com/euchud
