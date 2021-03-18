export const deserialize = (data: string) => {
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