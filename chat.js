const name_imput = document.getElementById("name_input");
const chat_window = document.getElementById("chat_window");
const message_input = document.getElementById("message_input");

const client_id = "chat_client_" + Math.random();

const options = {
    connectTimeout: 4000,
    // Authentication 
    clientId: client_id,
    //username: 'testuser',
    //password: '121212',
    keepalive: 60,
    clean: true,
}

// WebSocket connect url
const WebSocket_URL = 'ws://iotest.ml:8083/mqtt';
const client = mqtt.connect(WebSocket_URL, options);

client.on('connect', () => {
    console.log('Connect success');
    console.log('Yes!!!');
    client.subscribe("chat", function (err) {
        if (!err) {
            console.log("SUBSCRIBE - SUCCESS");
        } else {
            console.log("SUBSCRIBE - ERROR");
        }
    });
});

client.on('reconnect', (error) => {
    console.log('reconnecting:', error);
});

client.on('error', (error) => {
    console.log('Connect Error:', error);
});


client.on('message', function (topic, message) {
    console.log("Te topic is " + topic + " and the message is " + message.toString());
    //string to object
    const received = JSON.parse(message.toString());
    // Am i?
    if (received.name.trim() == name_imput.value.trim() ){
        chat_window.innerHTML = chat_window.innerHTML + '<div style="color:blue"> <b>' + received.msg + '</b></div>'
    }else{
        chat_window.innerHTML = chat_window.innerHTML + '<div style="color:grey"><i> ' + received.name + ': </i>' + received.msg + '</div>';
    }
    chat_window.scrollTop = chat_window.scrollHeight;
});



message_input.addEventListener('keyup', function (e){
    if (e.key === 'Enter' || e.keyCode === 13){
        //name?
        if (name_imput.value == ""){
            chat_window.innerHTML = chat_window.innerHTML + '<div style="color:red"> <b> Your name is empty!!! :( </b> </div>' ;
            return;
        }
        const to_send = {
            name: name_imput.value,
            msg: message_input.value
        }
        console.log(JSON.stringify(to_send));
        client.publish("chat", JSON.stringify(to_send));
        message_input.value = "";
    }
});
