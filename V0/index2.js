const corsProxy = require("cors-anywhere");
const corsServer = corsProxy.createServer({
	originWhitelist: []
});
corsServer.listen(3000, "localhost", function() {
	console.log(`Cors Anywhere service started.`);
});
var Waited = false
var UserName = "V12-Beta"
var UserCount = 100;
var PinCode = 5529616;

const { Session, Adapters, Events } = require('kahoot-api')
  
function AddBot(Pin, Username, CurrentI) {
    setTimeout(function() {
        var session = new Session(Pin, "http://localhost:3000/")
        session.openSocket()
            .then(socket => {
                const player = new Adapters.Player(socket);
                // console.log('Attempting join with: ' + Username);
                player.join(Username)
                    .then(() => {
                        console.log('Joined with: ' + Username);
                        player.on('player', msg => {
                            // console.log(msg)
                            if(msg.data.id == 2) {
                                if (Waited) {
                                    var AnswerNumber = Math.floor(Math.random() * Math.floor(4))
                                    console.log("Answering With: " + AnswerNumber)
                                    player.answer(AnswerNumber);
                                } else {
                                    setTimeout(function() {
                                        var AnswerNumber = Math.floor(Math.random() * Math.floor(4))
                                        console.log("Answering With: " + AnswerNumber)
                                        player.answer(AnswerNumber);
                                        Waited = true
                                    }, 300);
                                }
                            }
                            if (msg.data.id == 8) {
                                Waited = false
                            }
                        }); 
                    });
            });
    }, 50 * CurrentI);
}

for (i = 0; i < UserCount; i++) {
    AddBot(PinCode, UserName + "-" + i, i)
}