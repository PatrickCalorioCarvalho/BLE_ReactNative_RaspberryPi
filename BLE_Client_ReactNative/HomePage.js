/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  Text,
  TextInput,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  StyleSheet,
} from 'react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import { stringToBytes, bytesToString } from 'convert-string';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const Separator = () => (
  <View style={styles.separator} />
);

function HomePage() {
  const [disableBtnConectart, setdisableBtnConectart] = useState(false);
  const [disableEnviarDados, setdisableEnviarDados] = useState(true);
  const [SSID, setSSID] = useState('');
  const [PASSWORD, setPASSWORD] = useState('');
  const [URL, setURL] = useState('');
  const DispositivoRasberryPatrick = null;

  let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const BuscarDispositivo = () => {
    setdisableBtnConectart(true);
    BleManager.scan([], 10, true).then(() => {
      showMessage({
        message: 'Buscando RasberryPatrick',
        type: 'info',
        duration: 8000,
      });
    });
  };

  const BuscarDados = async event => {
    var resultado = true;
    BleManager.retrieveServices(this.DispositivoRasberryPatrick.id).then((peripheralInfo) => {
      BleManager.read(this.DispositivoRasberryPatrick.id,
        '10000000-710e-4a5b-8d75-3e5b444bc3cf',
        '10000001-710e-4a5b-8d75-3e5b444bc3cf'
        ).then((data) => {
          setSSID(bytesToString(data));
        })
        .catch((error) => {
          console.log(error);
          resultado = false;
        });
    });
    await sleep(2000);
    BleManager.retrieveServices(this.DispositivoRasberryPatrick.id).then((peripheralInfo) => {
      BleManager.read(this.DispositivoRasberryPatrick.id,
        '10000000-710e-4a5b-8d75-3e5b444bc3cf',
        '10000002-710e-4a5b-8d75-3e5b444bc3cf'
        ).then((data) => {
          setPASSWORD(bytesToString(data));
        })
        .catch((error) => {
          console.log(error);
          resultado = false;
        });
    });
    await sleep(2000);
    BleManager.retrieveServices(this.DispositivoRasberryPatrick.id).then((peripheralInfo) => {
      BleManager.read(this.DispositivoRasberryPatrick.id,
        '10000000-710e-4a5b-8d75-3e5b444bc3cf',
        '10000003-710e-4a5b-8d75-3e5b444bc3cf'
        ).then((data) => {
          setURL(bytesToString(data));
        })
        .catch((error) => {
          console.log(error);
          resultado = false;
        });
    });
    if (resultado) {
      showMessage({
        message: 'Dados Recebido do RasberryPatrick',
        type: 'success',
      });
      setdisableEnviarDados(false);
    } else {
      showMessage({
        message: 'Não foi possível Receber Dados do RasberryPatrick',
        type: 'danger',
      });
    }
  };
  const EnviarDados = async event => {
    setdisableEnviarDados(true);
    var resultado = true;
    BleManager.writeWithoutResponse(
        this.DispositivoRasberryPatrick.id,
        '10000000-710e-4a5b-8d75-3e5b444bc3cf',
        '10000001-710e-4a5b-8d75-3e5b444bc3cf',
        stringToBytes(SSID)
      )
      .then(() => {
        console.log('Enviado SSID');
      })
      .catch((error) => {
        console.log(error);
        resultado = false;
      });
    await sleep(2000);
    BleManager.writeWithoutResponse(
          this.DispositivoRasberryPatrick.id,
          '10000000-710e-4a5b-8d75-3e5b444bc3cf',
          '10000002-710e-4a5b-8d75-3e5b444bc3cf',
          stringToBytes(PASSWORD)
        )
        .then(() => {
          console.log('Enviado PASSWORD');
        })
        .catch((error) => {
          console.log(error);
          resultado = false;
        });
    await sleep(2000);
    BleManager.writeWithoutResponse(
          this.DispositivoRasberryPatrick.id,
          '10000000-710e-4a5b-8d75-3e5b444bc3cf',
          '10000003-710e-4a5b-8d75-3e5b444bc3cf',
          stringToBytes(URL)
        )
        .then(() => {
          console.log('Enviado URL');
        })
        .catch((error) => {
          console.log(error);
          resultado = false;
        });
        if (resultado) {
          showMessage({
            message: 'Dados Enviado para RasberryPatrick',
            type: 'success',
          });
          BuscarDados();
        } else {
          showMessage({
            message: 'Não foi possível Enviar Dados Para RasberryPatrick',
            type: 'danger',
          });
        }
  };

  const ConectarDispositivo = () => {
    BleManager.connect(this.DispositivoRasberryPatrick.id)
    .then(() => {
      console.log('Connected');
      showMessage({
        message: 'Conectado RasberryPatrick',
        type: 'success',
      });
      BuscarDados();
    })
    .catch((error) => {
      console.log(error);
      setdisableBtnConectart(false);
      showMessage({
        message: 'Erro ao Conectar RasberryPatrick',
        type: 'danger',
      });
    });
  };

  const handleDiscoverPeripheral = Peripheral => {
    console.log(Peripheral.name);
    if (Peripheral.name == 'RasberryPatrick') {
      this.DispositivoRasberryPatrick = Peripheral;
    }
  };

  const handleStopScan = () => {
    console.log(this.DispositivoRasberryPatrick);
    if (this.DispositivoRasberryPatrick != null) {
      showMessage({
        message: 'RasberryPatrick Encontrato',
        type: 'success',
      });
      ConectarDispositivo();
    } else {
      setdisableBtnConectart(false);
      showMessage({
        message: 'Não foi possível encontrar RasberryPatrick',
        type: 'warning',
      });
    }
  };

  useEffect(() => {
    BleManager.start({showAlert: false});

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }

    return (() => {
      console.log('unmount');
      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <Button
        disabled={disableBtnConectart}
        onPress={() => BuscarDispositivo()}
        title="Conectar RasberryPatrick"
        color="#841584"
      />
      <Separator />
      <Text style={styles.text}>SSID:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setSSID}
        value={SSID}
        editable={!disableEnviarDados}
      />
      <Text style={styles.text}>PASSWORD:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPASSWORD}
        value={PASSWORD}
        editable={!disableEnviarDados}
      />
      <Text style={styles.text}>URL:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setURL}
        value={URL}
        editable={!disableEnviarDados}
      />
      <Button
        disabled={disableEnviarDados}
        onPress={async () => EnviarDados()}
        title="Enviar Dados"
        color="#841584"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0.5,
    borderColor: '#737373',
    padding: 10,
  },
  text: {
    marginHorizontal: 15,
  },
});

export default HomePage;
