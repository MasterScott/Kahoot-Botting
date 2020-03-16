// V1
const corsProxy = require("cors-anywhere");
const RandomNames = require('random-name')
const { Session, Adapters, Events } = require('kahoot-api')


// Client Variables
var UserCount = 1000;
var PinCode = 7254964;

// Create the Cors Server
const corsServer = corsProxy.createServer({
    originWhitelist: []
});
corsServer.listen(3000, "localhost", function() {
    console.log(`Cors Anywhere service started.`);
});
var Waited = false;
var Bots = []

function AddBot(Pin, Username, CurrentI) {
    setTimeout(async function() {
        var session = new Session(Pin, "http://localhost:3000/")
        session.openSocket()
            .then(socket => {
                const player = new Adapters.Player(socket);
                player.join(Username)
                    .then(() => {
                        console.log('Joined with: ' + Username);
                        player.on('player', msg => {
                            // console.log(msg)
                            // Question Asked
                            if (msg.data.id == 2) {
                                if (Waited) {
                                    // The Players have already waited 600+ MS, Let them all run
                                    var AnswerNumber = Math.floor(Math.random() * Math.floor(4))
                                    console.log("Answering With: " + AnswerNumber)
                                    player.answer(AnswerNumber);
                                    Waited = true
                                } else {
                                    // The Players have not waited 600+ MS, force one to wait (Bypasses AntiBot's)
                                    setTimeout(function() {
                                        var AnswerNumber = Math.floor(Math.random() * Math.floor(4))
                                        console.log("Answering With: " + AnswerNumber)
                                        player.answer(AnswerNumber);
                                        Waited = true
                                    }, 619);
                                }
                            }
                            // Question Finished
                            if (msg.data.id == 8) {
                                Waited = false
                            }
                            if (msg.data.id == 10) {
								if (msg.data.content == '{"kickCode":1}') {
									console.log(Username + " Has been kicked from the game.")
								} else {
									console.log(Username + " Has left the game.")
								}
                            }
                        });
                    });
            });
    }, 50 * CurrentI);
}

for (i = 0; i < UserCount; i++) {
    var Name = RandomNames.first() + RandomNames.last()
    if (Name.length > 15) {
        Name = Name.slice(0, 15)
    }
    var TotalUpperCase = 0
    for (f = 0; f < Name.length; f++) {
        if (Name[f].toUpperCase() == Name[f]) {
            TotalUpperCase = TotalUpperCase + 1
        }
    }
    if (TotalUpperCase > 2) {
        var Name = RandomNames.first() + RandomNames.last()
        if (Name.length > 15) {
            Name.slice(0, 15)
        }
        var TotalUpperCase = 0
        for (f = 0; f < Name.length; f++) {
            if (Name[f].toUpperCase() == Name[f]) {
                TotalUpperCase = TotalUpperCase + 1
            }
        }
        if (TotalUpperCase > 2) {
            console.log(Name + " Is Gonna get banned and I'm to lazy to stop it.")
        }
    }

    AddBot(PinCode, Name, i)
}

/* 
Fake:
[{"ext":{"timetrack":1583974987542},"data":{"gameid":"1958672","id":45,"type":"message","content":"{\"choice\":2,\"questionIndex\":0,\"type\":\"quiz\",\"meta\":{\"lag\":50}}","cid":"813646473"},"channel":"/controller/1958672"}]

Real:
[{"ext":{"timetrack":1583974999853},"data":{"gameid":"1958672","id":45,"type":"message","content":"{\"type\":\"quiz\",\"choice\":0,\"questionIndex\":1,\"meta\":{\"lag\":56}}","cid":"790766823"},"channel":"/controller/1958672"}]
*/