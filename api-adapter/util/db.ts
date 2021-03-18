import { Pool, Client } from 'pg';

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
            reading       FLOAT     NOT NULL
        )
    `);
    console.log(`created moisture_reading table, if not exists.`);
    
    // watering
    res = await pool.query(`
        CREATE TABLE IF NOT EXISTS watering (
            id SERIAL PRIMARY KEY,
            sensor        INT        NOT NULL,
            length        INT        NOT NULL
        )
    `);
    console.log(`created watering table, if not exists.`);
}

export async function createMoistureReading(record: {
    sensor: number,
    reading: number
}) {
    const res = await pool.query(named(`
        INSERT INTO moisture_reading(sensor, reading)
            VALUES(:sensor, :reading)
    `)(record));
    console.log(res);
}

export default pool;

