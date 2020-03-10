const corsProxy = require("cors-anywhere");
const RandomNames = require('random-name')
const KahootAPI = require('kahoot-api')
const Session = KahootAPI.Session
const Adapters = KahootAPI.Adapters

// Client Variables
var UserCount = 1000;
var PinCode = 5922243;

// Create the Cors Server
const corsServer = corsProxy.createServer({
	originWhitelist: []
});
corsServer.listen(3000, "localhost", function() {
	console.log(`Cors Anywhere service started.`);
});

function AddBot(Pin, Username, CurrentI) {
    setTimeout(async function() {
        var session = new Session(Pin, "http://localhost:3000/")
            session.openSocket()
                .then(socket => {
                    const player = new Adapters.Player(socket);
                    console.log('Attempting join with: ' + Username);
                    try {
                        
                    player.join(Username)
                        .then(() => {
                            console.log('Joined with: ' + Username);
                        });
                    } catch(e) {
                        console.log("Error Joining with: " + Username + " With error code: " + e)
                    }
                });
    }, 50 * CurrentI);
}

for (i = 0; i < UserCount; i++) {
    AddBot(PinCode, RandomNames.first() + RandomNames.last(), i)
}