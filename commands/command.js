const config = require('../config.json');

module.exports = class Command {

  static isExecutable(msg) {
    return msg.content.charAt(0) === "!";
  }

  static byUser(msg, bot) {
    return msg.author !== bot.user;
  }

  static checker(msg) {
    return false;
  }

  static effect(msg) {}

  static tryExecute(msg) {
    if (this.checker(msg)) {
      this.effect(msg);
      return true;
    }
    return false;
  }

  static notFound(msg) {
    msg.channel.send('**Erreur Commande -** *La commande saisis n\'existe pas.*');
  }

  static noPermission(msg) {
    msg.channel.send('**Erreur Permission -** *Désolé mais je ne crois pas que tu aies les permissions suffisantes.*');
  }

}
