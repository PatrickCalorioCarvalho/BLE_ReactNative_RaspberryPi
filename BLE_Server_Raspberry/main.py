#!/usr/bin/python3

#sudo nano /etc/systemd/system/dbus-org.bluez.service -> 
    # ALterar Linha ExecStart=/usr/libexec/bluetooth/bluetoothd para ExecStart=/usr/libexec/bluetooth/bluetoothd -E
#pip install dbus-python
#apt-get python3-gi

import dbus
from advertisement import Advertisement
from service import Application, Service, Characteristic, Descriptor
import json

GATT_CHRC_IFACE = "org.bluez.GattCharacteristic1"
NOTIFY_TIMEOUT = 5000

class RasberryPatrickAdvertisement(Advertisement):
    def __init__(self, index):
        Advertisement.__init__(self, index, "peripheral")
        self.add_local_name("RasberryPatrick")
        self.include_tx_power = True

class RasberryPatrickService(Service):
    UUID_Advertisement = "10000000-710e-4a5b-8d75-3e5b444bc3cf"
    def __init__(self, index):
        Service.__init__(self, index, self.UUID_Advertisement, True)
        self.add_characteristic(SSIDCharacteristic(self))
        self.add_characteristic(PASSWORDCharacteristic(self))
        self.add_characteristic(URLCharacteristic(self))

class SSIDCharacteristic(Characteristic):
    UUID_SSIDCharacteristic = "10000001-710e-4a5b-8d75-3e5b444bc3cf"
    def __init__(self, service):
        Characteristic.__init__(
                self, self.UUID_SSIDCharacteristic,
                ["read", "write"], service)

    def WriteValue(self, value, options):
        with open("Config.json", "r") as read_file:
            data = json.load(read_file)
        data['SSID'] = ''.join([str(v) for v in value])
        with open("Config.json", "w") as write_file:
            json.dump(data, write_file)
        print(self.Valor)

    def ReadValue(self, options):
        with open("Config.json", "r") as read_file:
            data = json.load(read_file)
        value = []
        for c in data['SSID']:
            value.append(dbus.Byte(c.encode()))
        return value

class PASSWORDCharacteristic(Characteristic):
    UUID_PASSWORDCharacteristic = "10000002-710e-4a5b-8d75-3e5b444bc3cf"
    def __init__(self, service):
        Characteristic.__init__(
                self, self.UUID_PASSWORDCharacteristic,
                ["read", "write"], service)

    def WriteValue(self, value, options):
        with open("Config.json", "r") as read_file:
            data = json.load(read_file)
        data['PASSWORD'] = ''.join([str(v) for v in value])
        with open("Config.json", "w") as write_file:
            json.dump(data, write_file)
        print(self.Valor)

    def ReadValue(self, options):
        with open("Config.json", "r") as read_file:
            data = json.load(read_file)
        value = []
        for c in data['PASSWORD']:
            value.append(dbus.Byte(c.encode()))
        return value

class URLCharacteristic(Characteristic):
    UUID_URLCharacteristic = "10000003-710e-4a5b-8d75-3e5b444bc3cf"
    def __init__(self, service):
        Characteristic.__init__(
                self, self.UUID_URLCharacteristic,
                ["read", "write"], service)

    def WriteValue(self, value, options):
        with open("Config.json", "r") as read_file:
            data = json.load(read_file)
        data['URL'] = ''.join([str(v) for v in value])
        with open("Config.json", "w") as write_file:
            json.dump(data, write_file)
        print(self.Valor)

    def ReadValue(self, options):
        with open("Config.json", "r") as read_file:
            data = json.load(read_file)
        value = []
        for c in data['URL']:
            value.append(dbus.Byte(c.encode()))
        return value

app = Application()
app.add_service(RasberryPatrickService(0))
app.register()

adv = RasberryPatrickAdvertisement(0)
adv.register()

try:
    app.run()
except KeyboardInterrupt:
    app.quit()
