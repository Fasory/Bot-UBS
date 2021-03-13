// Package
const Discord = require('discord.js');
const config = require('./config.json');

// Constanste
const bot = new Discord.Client();
const Command = require('./commands/command');
const Ping = require('./commands/ping');
const Pong = require('./commands/pong');
const RolePannel = require('./commands/rolePannel');
var rolePannelStack = [];

bot.on('ready', function() {
  bot.user.setActivity('L2 MIS', {type : 'COMPETING'});
  // Spécifique au serveur L2 MIS - permet de retrouver le message en cas de restart
  for (var [id_guild, guild] of bot.guilds.cache) {
    channelFiliere = guild.channels.cache.find(channel => channel.name === 'filières-mis');
    console.log(channelFiliere);
    if (channelFiliere !== undefined && channelFiliere.lastMessage !== null && channelFiliere.lastMessage.author.bot){
      const msg = channelFiliere.lastMessage;
      var argsKey = new Map();
      var args = [];
      for (var line of msg.split('\n')){
        if (line.includes("  -  ")) {
          args.push(line.substr(6));
        }
      }
      var allRoles = [];
      for (var [id_roleREF, roleREF] of  msg.guild.roles.cache) {allRoles.push(roleREF);}
      for (var i = 0; i < args.length; i++) {
        for (var j = 0; j < allRoles.length; j++) {
          if (args[i] === allRoles[j].name) {
            args[i] = allRoles[j];
            break;
          }
        }
      }
      for (var i = 0; i < args.length; i++) {
        msg.react(this.reactREF[i]);
        argsKey.set(this.reactREF[i], args[i]);
      }
      rolePannelStack.push([msg.id, argsKey]);
    }
  }
  console.log(rolePannelStack);
})


bot.on('message', function(msg) {
  if (Command.isExecutable(msg) && Command.byUser(msg, bot)) {
    let commendExecute = Ping.tryExecute(msg) ||
                         Pong.tryExecute(msg) ||
                         RolePannel.tryExecute(msg, rolePannelStack) ||
                         Command.notFound(msg);
  }
})

bot.on('messageReactionAdd', function(react, user) {
  if (!user.bot) {
    for (var rolePannel of rolePannelStack) {
      if (rolePannel[0] === react.message.id) {
        react.message.guild.member(user).roles.add(rolePannel[1].get(react.emoji.name));
        break;
      }
    }
  }
})

bot.on('messageReactionRemove', function(react, user) {
  if (!user.bot) {
    for (var rolePannel of rolePannelStack) {
      if (rolePannel[0] === react.message.id) {

        react.message.guild.member(user).roles.remove(rolePannel[1].get(react.emoji.name));
        break;
      }
    }
  }
})


bot.login(process.env.TOKEN); //process.env.TOKEN sur github - cacher le TOKEN
