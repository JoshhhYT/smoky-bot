const Discord = require("discord.js");
const PREFIX = "!";
const YTDL = require("ytdl-core");
var fortunes = [
    "Yes",
    "No",
    "Maybe",
    "Without a doubt",
    "Obviously",
    "Obviously not"
]
var bot = new Discord.Client();
const size    = 64
const rainbow = new Array(size);

for (var i=0; i<size; i++) {
  var red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
  var blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
  var green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg

  rainbow[i] = '#'+ red + green + blue;
}

function sin_to_hex(i, phase) {
  var sin = Math.sin(Math.PI / size * 2 * i + phase);
  var int = Math.floor(sin * 127) + 128;
  var hex = int.toString(16);

  return hex.length === 1 ? '0'+hex : hex;
}

let place = 0;
var servers = {};

function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

  server.queue.shift();
   
  server.dispatcher.on("end", function () {
    if (server.queue[0]) play (connection, message);
    else connection.disconnect();
  });
}

function changeColor() {
  for (let index = 0; index < 1; ++index) {		
    bot.guilds.get([395216948469694466]).roles.find('name', "Vice Chairman").setColor(rainbow[place])
    bot.guilds.get([395216948469694466]).roles.find('name', "Chairman").setColor(rainbow[place])
		.catch(console.error);
		
    if(place == (size - 1)){
      place = 0;
    }else{
      place++;
    }
  }
}

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username}!`);
  if(60000 < 60000){console.log("The minimum speed is 60.000, if this gets abused your bot might get IP-banned"); process.exit(1);}
  setInterval(changeColor, 60000);
});

bot.on("ready", function() {
    console.log("Ready!");
});

bot.on("message", function(message){
    if (message.author.equals(bot.user)) return;
    
    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage("Pong!");
            break;
        case "help":
            message.channel.sendMessage(message.author.toString() + ", type `!commands` or `!cmds` to get started!")
            break;
        case "info":
            message.channel.sendMessage(message.author.toString() + ", **Smoky Bot** has been created on December 26th by <@249347110133170176>")
            break;
        case "8ball":
            if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random()*fortunes.length)] + ", " + message.author.toString() + ".");
            else message.channel.sendMessage("Can't read that," + message.author.toString() + "!");
            break;
        case "cmds":
            message.channel.sendMessage(message.author.toString() + ", I DMed you a list of commands!")
            message.author.sendMessage("Here is a list of commands for the server **Smoke'd**. \n\n`cmds; DMs you this list of commands. \ncommands; DMs you this list of commands. \nhelp; Shows up a help pannel on how to use the bot. \ninfo; shows up a info pannel about Smoky Bot. \nping; Pong! \n8ball; Can't answer a life-or-death question? This command can!`")
            break;
        case "commands":
            message.channel.sendMessage(message.author.toString() + ", I DMed you a list of commands!")
            message.author.sendMessage("Here is a list of commands for the server **Smoke'd**. \n\n`cmds; DMs you this list of commands. \ncommands; DMs you this list of commands. \nhelp; Shows up a help pannel on how to use the bot. \ninfo; shows up a info pannel about Smoky Bot. \nping; Pong! \n8ball; Can't answer a life-or-death question? This command can!`")
            break;
        case "play":
            if (!args[1]) {
              message.channel.sendMessage(message.author.toString() + ", make sure to provide a valid link.");
              return;
            }

            if (!message.member.voiceChannel) {
              message.channel.sendMessage(message.author.toString() + ", you must be in a voice channel to operate this command.");
              return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
              queue: []
            };
            
            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
              play(connection, message);
              message.channel.sendMessage("Song has been added")
            });
            break;
        case "skip":
            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        default:
            message.channel.sendMessage(message.author.toString() + ", invalid command! Say `!cmds` or `!commands` to view a list of commands")
    }
})

bot.login(process.env.BOT_TOKEN);
