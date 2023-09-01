document.getElementById('make_room').onclick = async (event)=>{
    event.preventDefault();
    console.log('make room');

    const path = "/createroom"
    const method = "POST"
    let name = document.getElementById("room_name").value;
    if (!name) {
        name = 'no name room'
    }
    try {
        const resp = await fetch(path, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
            }),
        })

        if (!resp.ok) {
            console.log(resp);
            return;
        }

        //部屋立て成功
        const json = await resp.json();
        console.log('make room success', json);
        //location.href = "./multidraw.html?roomid=" + json.roomid;
    }
    catch (err) {
        console.log(err);
        return;
    }
};

//join
document.getElementById("join_room").onclick = async ()=> {
    const select_room = document.getElementById("select_room");
    const selected_index = select_room.selectedIndex;
    const room_id = select_room.options[selected_index].value;
    location.href = "./lobby.html?room_id=" + room_id;
};