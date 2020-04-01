// V1
const corsProxy = require("cors-anywhere");
const { Session, Adapters, Events } = require('kahoot-api')
const prompt = require('prompt');


// Client Variables
var UserCount = 1;
var PinCode = 000000;
var GlobalUserame = "Bot"
var prompt_attributes = [
    {
        name: 'NumberOfBots',
        validator: /([0-9])+/,
        warning: 'User Count is not valid, it can only contain numbers.'
    },
    {
        name: 'PinCode',
        validator: /([0-9])+/,
        warning: 'PinCode is not valid, it can only contain numbers.'
    },
    {
        name: 'GlobalUserame',
    }
];
prompt.start();
prompt.get(prompt_attributes, function (err, result) {
    if (err) {
        console.log(err);
        return 1;
    }else {
        UserCount = result.NumberOfBots;
        PinCode = result.PinCode;
        GlobalUserame = result.GlobalUserame;
        console.log("Information recieved, Sending bots.");
		
		// Buggy Bad please dont use it
		var TakeoverAndFill = false

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
								Bots.push(player)
								player.on('player', msg => {
									// Question Asked
									if (msg.data.id == 2) {
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

									// Detect kick and leaving
									if (msg.data.id == 10) {
										if (msg.data.content == '{"kickCode":1}') {
											console.log(Username + " Has been kicked from the game.")
											player.leave()
										} else {
											console.log(Username + " Has left the game.")
											player.leave()
										}
									}
								});
							});
					});
			}, 50 * CurrentI);
		}

		for (i = 0; i < UserCount; i++) {
			var Name = `${GlobalUserame} - ${i}`
			AddBot(PinCode, Name, i)
		}
    }
});