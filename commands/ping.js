const Command = require('./command');

module.exports = class Ping extends Command {

  static checker(msg) {
    return msg.content === '!ping';
  }

  static effect(msg) {
    msg.channel.send('!pong');
  }
};
