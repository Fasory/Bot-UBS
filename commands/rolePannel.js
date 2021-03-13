const Command = require('./command');

module.exports = class RolePannel extends Command {

  static reactREF = ['🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹','🇺','🇻','🇼','🇽','🇾','🇿'];

  static tryExecute(msg, rolePannelStack) {
    if (this.checker(msg)) {
      if (msg.member.permissions.has(0x00000008)) {
        this.effect(msg, rolePannelStack);
      } else {
        this.noPermission(msg);
      }
      return true;
    }
    return false;
  }

  static checker(msg) {
    return msg.content.startsWith("!rolePannel");
  }

  static effect(msg, rolePannelStack) {
    // Take arguments
    var args = msg.content.substr(11);
    args = args.split(",");
    for (var i = 0; i < args.length; i++) {
      args[i] = args[i].trim();
    }
    const tempArgs = args;
    args = [];
    for (var arg of tempArgs) {if (arg !== "") {args.push(arg);}}
    // On récupère tous les rôles existant
    var allRoles = [];
    for (var [id_roleREF, roleREF] of  msg.guild.roles.cache) {allRoles.push(roleREF);}
    // On repère si un rôle n'existe pas
    var notExist = [];
    for (var i = 0; i < args.length; i++) {
      var find = false;
      for (var j = 0; j < allRoles.length; j++) {
        if (args[i] === allRoles[j].name) {
          args[i] = allRoles[j];
          find = true;
          break;
        }
      }
      if (!find) {notExist.push(args[i])}
    }
    if (notExist.length > 0 || args.length < 1 || args.length > 26) {
      this.invalidRole(msg, notExist);
      return;
    }
    // On peut crée le RolePannel une fois que tout va bien
    var msgPannel = '**@everyone\n#####       > Rôle Pannel <       #####** \n\n     *Réagis à ce message en fonction du\nrôle que tu souhaites avoir !*\n';
    for (var i = 0; i < args.length; i++) {
      msgPannel += "\n"+this.reactREF[i]+"  -  "+args[i].name
    }
    msgPannel += '**\n########################**'
    msg.channel.send(msgPannel).then(message => this.react(message, args, rolePannelStack));
  }

  static invalidRole(msg, args) {
    if (args.length === 0) {msg.channel.send('**Erreur Arguments -** *Usage : !rolePannel <Role 1> [, <Role 2>, ... <Role n>]*');}
    else if (args.length === 1) {msg.channel.send('**Erreur Arguments -** *Le rôle '+args[0]+' n\'existe pas.*');}
    else if (args.length > 26) {msg.channel.send('**Erreur Arguments -** *Désolé mais tu ne peux passer au maximum 26 rôles en paramètre.*');}
    else {msg.channel.send('**Erreur Arguments -** *Les rôles '+args.join(", ")+' n\'existent pas.*');}
  }

  static noPermission(msg) {
    msg.channel.send('**Erreur Permission -** *Tu as besoin de la permission d\'administrateur pour faire cela.*');
  }

  static react(msg, args, rolePannelStack) {
    var argsKey = new Map();
    for (var i = 0; i < args.length; i++) {
      msg.react(this.reactREF[i]);
      argsKey.set(this.reactREF[i], args[i]);
    }
    rolePannelStack.push([msg.id, argsKey]);
  }
};
