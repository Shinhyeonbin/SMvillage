const server = "http://192.168.1.6";

function move(destination, tmp_theta) {

    switch (destination) {
        case "Jeahyun":
            tmp_x = -6.73;
            tmp_y = 6.71;
            break;
        case "Karina":
            tmp_x = -8.16;
            tmp_y = 2.24;
            break;
        case "SMHostipal":
            tmp_x = -4.78;
            tmp_y = 2.31;
            break;
        case "SoomoongConvinence":
            tmp_x = -3.65;
            tmp_y = 3.81;
            break;
        case "Stopmini":
            tmp_x = -2.14;
            tmp_y = 2.94;
            break;
        case "SMUniversity":
            tmp_x = 2;
            tmp_y = 3.01;
            break;
        case "SMPostoffice":
            tmp_x = 2.03;
            tmp_y = 4.80;
            break;
        case "Policestation":
            tmp_x = 5.30;
            tmp_y = 3.38;
            break;
        case "DeerMed":
            tmp_x = 6.01;
            tmp_y = 0.99;
            break;
        case "StartingPoint":
            tmp_x = 0;
            tmp_y = 0;
            break;
        case "stopmini":
            tmp_x = -2.14;
            tmp_y = 2.94;
            break;
        case "STOPMINI":
            tmp_x = -2.14;
            tmp_y = 2.94;
            break;
        default:
            alert("Wrong destination");
            break;
    }

    console.log("init - [fn_click_send]");

    console.log("tmp_x:" + tmp_x);
    console.log("tmp_y:" + tmp_y);
    console.log("tmp_theta:" + tmp_theta);

    const pi = Math.PI;
    const theta = parseFloat(tmp_theta) * parseFloat((pi / 180));
    fn_cmd_nav_by_coordinate(tmp_x, tmp_y, parseFloat(theta), destination);
}

var voices = [];
function setVoiceList() {
    voices = window.speechSynthesis.getVoices();
}

setVoiceList();

if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = setVoiceList;
}

function speak(txt) {
    console.log("speak " + txt);
    if (!window.speechSynthesis) {
        alert("A browser that does not support voice playback. Use Chrome, Firefox and more recent browsers");
        return;
    }

    var lang = 'ko-KR';
    var utterThis = new SpeechSynthesisUtterance(txt);

    utterThis.onend = function (event) {
        console.log('end');
    };

    utterThis.onerror = function (event) {
        console.log('error', event);
    };

    var voiceFound = false;

    for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang.indexOf(lang) >= 0 || voices[i].lang.indexOf(lang.replace('-', '_')) >= 0) {
            utterThis.voice = voices[i];
            voiceFound = true;
        }
    }
    if (!voiceFound) {
        alert('voice not found');
        return;
    }

    utterThis.lang = lang;
    utterThis.pitch = 1;
    utterThis.rate = 1; 

    window.speechSynthesis.speak(utterThis);
}

function g_gout() {
    var t = document.getElementById("code_reddit");
    speech(t.value);
}

function fn_cmd_nav_by_coordinate(arg_x, arg_y, arg_theta, destination) {

    console.log("init - [fn_cmd_nav_by_coordinate] " + arg_x + ", " + arg_y + ", " + arg_theta);
    const response = fetch(server + '/cmd/nav', {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8', },
        body: JSON.stringify({
            "x": parseFloat(arg_x),
            "y": parseFloat(arg_y),
            "theta": parseFloat(arg_theta),
        })
    })
    .then(response => {
        //console.log("Inter then");
        if (response.status == 405) {
            console.log("405 Error catch!");
        }
        else if(response.status == 404) {
            console.log("404 Error catch!\nCheck your internet");
        } 
        else {
            let result = response.text()
            result.then(res => {
                console.log(res)
            })
        }
    })
    .catch(error => {
        console.log("Catch Another Error");
        alert("Moving to " + destination);
        alert("Arrive at " + destination);
    });
}
