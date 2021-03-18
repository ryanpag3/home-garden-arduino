import express = require('express');
import { getMoistureReadings, getWaterings } from './util/db';
const app = express();
const port = process.env.ADAPTER_PORT || 3000;

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
        res.status(500);
        res.send(e.message);
    }
});

app.post('/water_plant', async (req: express.Request, res: express.Response) => {
    console.log('water plant!');
});

export const startWebserver = async () => {
    app.listen(port, () => {
        console.log(`listening for requests on http://localhost:${port}`);
    });
}

export default app;