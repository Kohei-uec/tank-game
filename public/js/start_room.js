document.getElementById('make_room').onclick = async (event) => {
    event.preventDefault();
    console.log('make room');

    const path = '/createroom';
    const method = 'POST';
    let name = document.getElementById('room_name').value;
    if (!name) {
        name = 'no name room';
    }
    try {
        const resp = await fetch(path, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
            }),
        });

        if (!resp.ok) {
            console.log(resp);
            return;
        }

        //部屋立て成功
        const json = await resp.json();
        console.log('make room success', json);
        //location.href = "./multidraw.html?roomid=" + json.roomid;
    } catch (err) {
        console.log(err);
        return;
    }
};

//join
document.getElementById('join_room').onclick = async () => {
    const select_room = document.getElementById('select_room');
    const selected_index = select_room.selectedIndex;
    const room_id = select_room.options[selected_index].value;
    location.href = './lobby.html?room_id=' + room_id;
};

//定期的にroomを読み込む
document.getElementById('reload_rooms').onclick = setRooms;
setInterval(setRooms, 5000);
async function setRooms() {
    const rooms = await getRooms();
    updateRooms(rooms);
}

//room一覧を取得
async function getRooms() {
    const resp = await fetch('/getrooms');
    const json = await resp.json();
    const rooms = new Map();
    for (const [key, value] of Object.entries(json)) {
        rooms.set(key, value);
    }
    return rooms;
}

//room一覧を更新
function updateRooms(rooms) {
    if (rooms.size <= 0) return;
    const select = document.getElementById('select_room');
    select.innerHTML = '';
    for (const room of rooms.values()) {
        const elm = document.createElement('option');
        elm.value = room.id;
        elm.innerText = '[' + room.id + '] ' + room.name;
        select.appendChild(elm);
    }
}
