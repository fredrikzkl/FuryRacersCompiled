
var backend;
var username;
var rumble = false;

function addMessageHandler(callback) {
    backend = new WebSocket('ws://' + window.location.hostname + ':3001/ws');

    backend.onmessage = function(e) {
        var msg = JSON.parse(e.data);

        if (msg.action === "identify") {
            if (!msg.data) {
                var id = localStorage.getItem("id-gsusfcavf");

                if (id == null) {
                    id = Math.random().toString(36).substring(7);

                    localStorage.setItem("id-gsusfcavf", id)
                }

                setUsername(id);
                sendToBackend("identify", id);
            } else if (msg.data === "ok") {
                sendToBackend("get username", getId());

                callback("identified");
            } else {
                var id = sessionStorage.getItem("id-gsusfcavf");

                if (id == null) {
                    id = Math.random().toString(36).substring(7);

                    sessionStorage.setItem("id-gsusfcavf", id)
                }

                setUsername(id);
                sendToBackend("identify", id);
            }
        } else if (msg.action === "redirect") {
            var gameName = msg.data.toLowerCase()

            if (document.location.href.indexOf(gameName) < 0) {
                document.location.href = "/" + gameName;
            }
        } else if (msg.action === "set username") {
            if (msg.data === "error") {
                alert("Username already in use")
            }
        } else if (msg.action === "get username") {
            username = msg.data[1];
        }else if(msg.action === "rumble on"){
            rumbleOn();
        }else if(msg.action === "rumble off"){
            rumbleOff();
        }else if(msg.action === "set color"){
            setBackgroundColor(msg.data);
        }else if(msg.action === "set carModel"){
            setCarModel(msg.data);
        }
        else {
            callback(msg);
        }
    }
}

function rumbleOn() {

    if(!rumble){
        window.navigator.vibrate(1000);
        rumble = true;
    }
}

function rumbleOff() {


    window.navigator.vibrate(0);
    rumble = false;
}

function sendToGame(action, data) {
    send({
        "to": "game",
        "action": "pass through",
        "data": {
            "action": action,
            "data": data
        }
    });
}

function sendToBackend(action, data) {
    send({
        "action": action,
        "data": data
    });
}

function send(json) {
    if (backend) {
        backend.send(JSON.stringify(json));
    }
}

function getId() {
    var id;

    if (sessionStorage.getItem("id-gsusfcavf")) {
        id = sessionStorage.getItem("id-gsusfcavf");
    } else {
        id = localStorage.getItem("id-gsusfcavf");
    }

    return id;
}

function setUsername(newUsername){

    username = newUsername;
 
}

function getUsername(){

    return username;
}

