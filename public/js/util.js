export function map2stringJSON (map) {
    return JSON.stringify(Object.fromEntries(map));
}

export function JSON2map (json) {
    const map = new Map();
    for (const [key, value] of Object.entries(json)) {
        map.set(key, value);
    }
    return map;
}

export function stringJSON2map (str) {
    const json = JSON.parse(str);
    const map = new Map();
    for (const [key, value] of Object.entries(json)) {
        map.set(key, value);
    }
    return map;
}