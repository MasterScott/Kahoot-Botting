const corsProxy = require("cors-anywhere");
const corsServer = corsProxy.createServer({
	originWhitelist: []
});
corsServer.listen(3000, "localhost", function() {
	console.log(`Cors Anywhere service started.`);
});

var UserName = "Bot"
var UserCount = 1000;
var PinCode = 767620;

const KahootAPI = require('kahoot-api')
const Session = KahootAPI.Session
const Adapters = KahootAPI.Adapters

function AddBot(Pin, Username, CurrentI) {
    setTimeout(function() {
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
    AddBot(PinCode, UserName + " - " + i, i)
}