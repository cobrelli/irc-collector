var config = {
	channels: [""],
	server: "",
	botName: ""
}

var irc = require("irc");
var pg = require('pg'); 

bot = new irc.Client(config.server, config.botName, {channels: config.channels});

bot.addListener("message", function(from, to, text, message) {
	if(text.length < 2){return}
	
	var messages = text.split(" ");
	
	var conString = "postgres://user:pass@localhost/db";
	pg.connect(conString, function(err,client,done) {
  		if(err) {
    			return console.error('could not connect to postgres', err);
  		}
		messages.forEach(function(word){
			if(word.length<2){return}
	  		client.query("insert into robo (time, word, user_name) values (CURRENT_TIMESTAMP, $1, $2);", [word,from], function(err, result) {
				done();
	    			if(err) {
      					return console.error('error running query', err);
    				}
  			});
		});
	});
});


