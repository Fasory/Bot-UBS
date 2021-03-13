const Command = require('./command');

module.exports = class Pong extends Command {

  static checker(msg) {
    return msg.content === '!pong';
  }

  static effect(msg) {
    msg.channel.send('!ping');
  }
};
