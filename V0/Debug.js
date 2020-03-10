const corsProxy = require("cors-anywhere");
const { Session, Adapters, Events } = require('kahoot-api')

var Waited = false;
var UserName = "Debug Bot";
var UserCount = 1;
var PinCode = 8231071;

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
                player.join(Username)
                    .then(() => {
                        console.log('Joined with: ' + Username);
                        player.on('player', msg => {
                            console.log(msg)
                        }); 
                    });
            });
    }, 100 * CurrentI);
}

for (i = 0; i < UserCount; i++) {
    AddBot(PinCode, UserName + "-" + i, i)
}