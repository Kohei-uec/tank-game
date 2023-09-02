import { stringJSON2map } from "./util.js";

//return the socket
export async function connectSocket(){
    const myUsername = localStorage.getItem("username");
    const url = new URL(window.location.href);
    //console.log(url.host);
    let pre = "wss";
    if(url.host === "localhost:8000"){
        pre = "ws"
    }
    const room_id =url.searchParams.get("room_id");
    document.getElementById("room_id").innerText = room_id;
    const socket = new WebSocket(
        `${pre}://${url.host}/join_lobby?name=${myUsername}&room=${room_id}`,
    );
    console.log(socket);

    socket.onmessage = (m) => {
        const data = JSON.parse(m.data);
        switchSocketEvent(data)
    };

    socket.onclose = (m) => {
        console.log(m)
        //location.href = "./index.html";
    }

    return socket;
}

const event2func = {};

export function setSocketEventListener(event, func){
    event2func[event] = func;
}

function switchSocketEvent(data) {
    console.log(data);
    const func = event2func[data.event];
    if (!func) {
        console.log("unexpected event:", data.event);
        return;
    }
    func(data);
    return;
}

//default event listener
setSocketEventListener('update_players',(data)=>{
    // refresh displayed user list
    console.log(stringJSON2map(data.players));
    return;
    let userListHtml = "";
    for (const name of data.players) {
        userListHtml += `<div> ${name} </div>`;
    }
    document.getElementById("users").innerHTML = userListHtml;
    return;
});

/*
    
    if (data.event === "update-lines"){
        lines = data.lines;
        return;
    }

    if (data.event === "update-BGcolor"){
        tool.setBackgroundColor(data.BGcolor);
        return;
    }

    if (data.event === "update-text") {
        document.getElementById("title").value = data.title;
        document.getElementById("text-contents").value = data.text_contents;
        return;
    }

    if (data.event === "update-states") {       
        lines = data.lines;
        tool.setBackgroundColor(data.BGcolor);
        document.getElementById("title").value = data.title;
        document.getElementById("text-contents").value = data.text_contents;
        return;
    }

    if (data.event === "room-end") {
        //only owner
        console.log("room end");
        return;
    }

    if(data.event === "isOwner"){
        //タイトルと本文解放
        document.getElementById("title").disabled = false;
        document.getElementById("text-contents").disabled = false;

        //ルームを閉じるボタン
        const clsbtn = document.getElementById("roomclose");
        clsbtn.style.display = "inline-block";
        clsbtn.disabled = false;
        clsbtn.onclick = ()=>{
            socket.send(
                JSON.stringify({
                    event: "end",
                })
            );
            //location.href = "./index.html";
        };

        //投稿ボタン
        const submitbtn = document.getElementById("submit-btn");
        submitbtn.style.display = "inline-block";
        submitbtn.disabled = false;

        return;
    }

    if (data.event === "update-time"){
        document.getElementById("time").textContent = data.time_text;
        timeover = data.timeover;
    }


}

function pushLine(line) {
    socket.send(
        JSON.stringify({
        event: "push-line",
        line: line,
      }),
  )
}

function changeText(title,text_contents) {
    socket.send(
        JSON.stringify({
            event: "change-text",
            title: title,
            text_contents: text_contents,
        })
    );
}
*/