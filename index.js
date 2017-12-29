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

function play(connection, message) {
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
    bot.guilds.get("395216948469694466").roles.find('name', "Vice Chairman").setColor(rainbow[place])
    bot.guilds.get("395216948469694466").roles.find('name', "Chairman").setColor(rainbow[place])
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
    let Admin = message.guild.roles.find("name", "Admin");
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
        var embed = new Discord.RichEmbed()
          .addField("Public Commands", "!cmds - Sends this message\n!commands - Sends this message\n!help - Shows up a help pannel\n!info - Shows up an info pannel about Smoky Bot\n!ping - Pong!\n!8ball - Answers life-or-death questions", true)
          .addField("Administration Commands", "!ban - Bans a player from the server\n!kick - Kicks a player from the server", true)
	  .setColor(849283)
          .setFooter("Smoky Bot©")
        message.author.sendEmbed(embed);
        break;
        case "commands":
        message.channel.sendMessage(message.author.toString() + ", I DMed you a list of commands!")
        var embed = new Discord.RichEmbed()
          .addField("Public Commands", "!cmds - Sends this message\n!commands - Sends this message\n!help - Shows up a help pannel\n!info - Shows up an info pannel about Smoky Bot\n!ping - Pong!\n!8ball - Answers life-or-death questions", true)
          .addField("Administration Commands", "!ban - Bans a player from the server\n!kick - Kicks a player from the server", true)
          .setColor(849283)
          .setFooter("Smoky Bot©")
        message.author.sendEmbed(embed);
        break;
        case "kick":
        if(message.member.roles.has(Admin.id)) {
          if (args[1]) { 
          let kickMember = message.guild.member(message.mentions.users.first());
          message.guild.member(kickMember).kick();
          message.channel.sendMessage("The user has been kicked from **Smoke'd**.");
        } else {
          return message.reply(message.author.toString() + ", you dont have the permission to ban members.");
        }} else message.channel.sendMessage(message.author.toString() + ", make sure to provide an user!")
        break;
      	case "ban":
        if(message.member.roles.has(Admin.id)) {
          if (args[1]) { 
          let banMember = message.guild.member(message.mentions.users.first());
          message.guild.member(banMember).ban();
          message.channel.sendMessage("The user has been banned from **Smoke'd**.");
        } else {
          return message.reply(message.author.toString() + ", you dont have the permission to ban members.");
        }} else message.channel.sendMessage(message.author.toString() + ", make sure to provide an user!")
        break;
        default:
            message.channel.sendMessage(message.author.toString() + ", invalid command! Say `!cmds` or `!commands` to view a list of commands")
    }
})

bot.login(process.env.BOT_TOKEN);
