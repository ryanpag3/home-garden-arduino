require('dotenv').config();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

import serial from './handler/serial';
import { startWebserver } from './server';
import { setupDb } from './util/db';
import './util/cronjobs';

const serialBus = process.env.SERIAL_BUS;

const isMockSerialBus = () => {
    return serialBus === 'development';
}

export let port;

async function main() {
    await setupDb();
    await startWebserver();

    if (isMockSerialBus()) {
        console.log('using mock serial bus');
        port = {
            write: (c) => { console.log(c) }
        };
        return;
    }

    port = new SerialPort(serialBus, { baudRate: 9600 });
    const parser = port.pipe(new Readline({ delimiter: '\n'}));

    port.on("open", () => {
        console.log('serial port open');
    });

    port.on("close", () => {
        console.log('reopening port');
        port.open((err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    parser.on('data', async (data) => serial(data));
} main();

