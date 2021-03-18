import { Pool } from 'pg';
import { shortSinceToSeconds } from './time';

const named = require('yesql').pg;

const pool = new Pool();

/**
 * No fancy ORM here. Only a few tables and queries.
 */
export async function setupDb() {
    await createTables();
}

async function createTables() {
    // moisture_reading
    let res = await pool.query(`
        CREATE TABLE IF NOT EXISTS moisture_reading (
            id SERIAL PRIMARY KEY,
            sensor        INT        NOT NULL,
            reading       FLOAT     NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);
    console.log(`created moisture_reading table, if not exists.`);
    
    // watering
    res = await pool.query(`
        CREATE TABLE IF NOT EXISTS watering (
            id SERIAL PRIMARY KEY,
            sensor        INT        NOT NULL,
            length        INT        NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);
    console.log(`created watering table, if not exists.`);
}

export async function createMoistureReading(record: {
    sensor: number,
    reading: number
}) {
    await pool.query(named(`
        INSERT INTO moisture_reading(sensor, reading)
            VALUES(:sensor, :reading)
    `)(record));
    console.log(`new moisture reading created. sensor: ${record.sensor} | reading: ${record.reading}`);
}

export async function createWatering(record: {
    sensor: number;
    length: number;
}) {
    await pool.query(named(`
    INSERT INTO watering(sensor, length)
        VALUES(:sensor, :length)
    `)(record));
    console.log(`new watering created. sensor: ${record.sensor} | length: ${record.length}`);
}

export async function getMoistureReadings(amtTime: string) {
    const inMillis = shortSinceToSeconds(amtTime) * 1000;
    const startDate = new Date(new Date().getTime() - inMillis);
    const res = await pool.query(named(`
        SELECT * FROM moisture_reading
            WHERE created_at between :startDate and now();
    `)({ startDate }));
    console.log(`found ${res.rows.length} moisture readings for ${amtTime} ago.`);
    return res;
}

export async function getWaterings(amtTime: string) {
    const inMillis = shortSinceToSeconds(amtTime) * 1000;
    const startDate = new Date(new Date().getTime() - inMillis);
    const res = await pool.query(named(`
        SELECT * FROM waterings
            WHERE created_at between :startDate and now();
    `)({ startDate }));
    console.log(`found ${res.rows.length} waterings for ${amtTime} ago.`);
    return res;
}

export default pool;

