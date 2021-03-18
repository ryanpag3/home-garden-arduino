import { createMoistureReading } from '../util/db';


export default async (data: string) => {
    const asObject: any = deserialize(data);
    switch(asObject.type) {
        case 'moisture_reading':
            return createMoistureReading(asObject);
    }
}

const deserialize = (data: string) => {
    const obj = {};
    const split = data.split(';');
    const type = split[0];
    split.splice(0,1);
    for (const element of split) {
        const eleSplit = element.split(':');
        // arduino sends this back and we dont want it
        if (eleSplit[0] === '\r') continue;
        obj[eleSplit[0]] = eleSplit[1];
    }
    obj['type'] = type;
    return obj;
}