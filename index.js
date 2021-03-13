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
