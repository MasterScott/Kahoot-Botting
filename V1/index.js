// V1
const corsProxy = require("cors-anywhere");
const RandomNames = require('random-name')
const { Session, Adapters, Events } = require('kahoot-api')

// Client Variables
var UserCount = 5000;
var PinCode = 7685633;

// Create the Cors Server
const corsServer = corsProxy.createServer({
	originWhitelist: []
});
corsServer.listen(3000, "localhost", function() {
	console.log(`Cors Anywhere service started.`);
});
var Waited = false;

  
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
                            if(msg.data.id == 2) {
                                if (Waited) {
                                    // The Players have already waited 250 MS, Let them all run
                                    var AnswerNumber = Math.floor(Math.random() * Math.floor(4))
                                    console.log("Answering With: " + AnswerNumber)
                                    player.answer(AnswerNumber);
                                } else {
                                    // The Players have not waited 250 MS, force one to wait
                                    setTimeout(function() {
                                        var AnswerNumber = Math.floor(Math.random() * Math.floor(4))
                                        console.log("Answering With: " + AnswerNumber)
                                        player.answer(AnswerNumber);
                                        Waited = true
                                    }, 250);
                                }
                            }
                            // Question Finished
                            if (msg.data.id == 8) {
                                Waited = false
                            }
                        }); 
                    });
            });
    }, 50 * CurrentI);
}

for (i = 0; i < UserCount; i++) {
    AddBot(PinCode, RandomNames.first() + RandomNames.last(), i)
}