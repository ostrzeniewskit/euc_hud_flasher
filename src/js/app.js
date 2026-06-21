import { SerialConnection }       from './serial/SerialConnection.js';
import { DeviceConfigurator }     from './device/DeviceConfigurator.js';
import { FirmwareVersionLoader }  from './firmware/FirmwareVersionLoader.js';
import { FirmwareSelector }       from './firmware/FirmwareSelector.js';
import { StatusDisplay }          from './ui/StatusDisplay.js';
import { ConfiguratorUI }         from './ui/ConfiguratorUI.js';

class App {
  async init() {
    const connection   = new SerialConnection();
    const configurator = new DeviceConfigurator(connection);
    const status       = new StatusDisplay(document.getElementById('status'));

    new ConfiguratorUI(connection, configurator, status);

    await new FirmwareSelector(
      document.getElementById('firmwareVersion'),
      document.getElementById('versionNotes'),
      document.getElementById('flashButton'),
      new FirmwareVersionLoader()
    ).init();
  }
}

new App().init();
