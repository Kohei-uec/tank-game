const event2func = {};

export function setMyEventListener(event, func){
    event2func[event] = func;
}

export function switchMyEvent(data, options) {
    //console.log(data);
    const func = event2func[data.event];
    if (!func) {
        console.log("unexpected event:", data.event);
        return;
    }
    func(data, options);
    return;
}