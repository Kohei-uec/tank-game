let socket;
connectSocket();

async function connectSocket(){
    const myUsername = localStorage.getItem("username");
    const url = new URL(window.location.href);
    //console.log(url.host);
    let pre = "wss";
    if(url.host === "localhost:8000"){
        pre = "ws"
    }
    const room_id =url.searchParams.get("room_id");
    document.getElementById("room_id").innerText = room_id;
    socket = new WebSocket(
        `${pre}://${url.host}/join_lobby?name=${myUsername}&room=${room_id}`,
    );
    console.log(socket);

    socket.onmessage = (m) => {
        const data = JSON.parse(m.data);
        console.log(data);
    
        if (data.event === "update-users") {
            // refresh displayed user list
            let userListHtml = "";
            for (const username of data.usernames) {
                userListHtml += `<div> ${username} </div>`;
            }
            document.getElementById("users").innerHTML = userListHtml;
            return;
        }
        
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

        console.log("unexpected event:", data.event);
    };

    socket.onclose = (m) => {
        console.log(m)
        //location.href = "./index.html";
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
