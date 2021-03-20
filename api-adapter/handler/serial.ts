import { createMoistureReading, createWatering } from '../util/db';
import { deserialize } from '../util/message';
import MESSAGE_TYPE from '../constant/message-type';


export default async (data: string) => {
    try {
        console.log(data);
        const asObject: any = deserialize(data);
        switch (asObject.type) {
            case MESSAGE_TYPE.MOISTURE_READING:
                return await createMoistureReading(asObject);
            case MESSAGE_TYPE.WATERING:
                return await createWatering(asObject);
            default:
                console.error(`Unknown message type received: ${asObject.type}`);
        }
    } catch (e) {
        console.error(`Error while processing serial message.`, e);
    }
}