require('dotenv').config();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

import serial from './handler/serial';
import { startWebserver } from './server';
import { setupDb } from './util/db';

const port = new SerialPort('/dev/cu.usbmodem141301', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n'}));

async function main() {
    await setupDb();
    await startWebserver();

    port.on("open", () => {
        console.log('serial port open');
    });
    
    parser.on('data', async (data) => serial(data));
} main();

