// You can only add 1 bot per socket

const corsProxy = require("cors-anywhere");
const corsServer = corsProxy.createServer({
  originWhitelist: []
});
corsServer.listen(3000, "localhost", function() {
    console.log(`[+] CORS anywhere running on port ${3000}`);
});

// User defined Variables
var UserCount = 1
var UserName = "Bot"

const KahootAPI = require('kahoot-api')
const Session = KahootAPI.Session
const Adapters = KahootAPI.Adapters

//import KahootAPI from '@omegaboot/kahoot-api'
for (i=0; i < UserCount; i++) {
    var session = new Session(5720569, "http://localhost:3000/")
    session.openSocket() //Connect
    .then(socket => {
            const player = new Adapters.Player(socket); //Create player class
            player.join(UserName + " - " + i) //Join with name
            .then(() => {
                console.log('Logged in with user: ' + UserName + " - " + i);
            });
    });
}



/**
session.openSocket() //Connect
    .then(socket => {
        var i = 0;
        for (i = 0; i < UserCount; i++) {
            const player = new Adapters.Player(socket); //Create player class
            player.join(UserName + " - " + i) //Join with name
            .then(() => {
                console.log('Logged in with user: ' + UserName + " - " + i);
            });
        }
    });
*/