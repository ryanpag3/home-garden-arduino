import express = require('express');
import cors = require('cors');
import { getMoistureReadings, getWaterings } from './util/db';
import { port } from '.';
const app = express();
const serverPort = process.env.ADAPTER_PORT || 3000;

app.use(cors());

app.get('/moisture_reading', async (req: express.Request, res: express.Response) => {
    try {
        const timeFrom: any = req.query['timeFrom'];
        if (!timeFrom) {
            res.status(400);
            return res.send(`timeFrom is required.`);
        }
        const queryResult = await getMoistureReadings(timeFrom);
        res.send(queryResult.rows);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e.message);
    }
});

app.get('/watering', async (req: express.Request, res: express.Response) => {
    try {
        const timeFrom: any = req.query['timeFrom'];
        if (!timeFrom) {
            res.status(400);
            return res.send(`timeFrom is required.`);
        }
        const queryResult = await getWaterings(timeFrom);
        res.send(queryResult.rows);
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send(e.message);
    }
});

app.post('/run_tasks', async (req: express.Request, res: express.Response) => {
    console.log('water plant!');
    port.write('RUNTASKS\n', (err) => {
        if (err) {
            console.log(err);
        }
        console.log('message written');
    })
    res.send(200);
});

app.post('/water_plant', async (req: express.Request, res: express.Response) => {
    console.log('water plant!');
    port.write('WATERPLANT\n', (err) => {
        if (err) {
            console.log(err);
        }
        console.log('message written');
    })
    res.send(200);
});

export const startWebserver = async () => {
    app.listen(serverPort, () => {
        console.log(`listening for requests on http://localhost:${serverPort}`);
    });
}

export default app;