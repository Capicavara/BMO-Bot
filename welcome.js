const Discord = require("discord.js"), // npm install discord.js
ms = require("ms"), // npm install ms
AsciiTable = require("ascii-table"); // npm install ascii-table
// Replace json.sqlite by the file name of your choice
var author;
var Role;

const config = require("./config.json"), // Load config.json file
functions = require("./functions.js"),
bot = new Discord.Client(); // Create the discord Client
bot.login(config.token); // Discord authentification

bot.on("ready", () => { // When the bot is ready
  console.log("Welcome OK!");
  Role1 = bot.guilds.get('699806912602177607').roles.get('704153927649591358');
  Role2 = bot.guilds.get('699806912602177607').roles.get('754355893126299668');
  console.log(Role1.name + " " + Role2.name);
});


bot.on("message", (message) => {
  
  // If the message comes from a bot, cancel
  if(message.author.bot){
    return;
  }
  
  // If the message does not start with the prefix, cancel
  if(!message.content.startsWith(config.prefix)){
    return;
  }
  
  // Update message mentions
  //message.mentions.members = message.mentions.members.filter((m) => !m.user.bot);
  //message.member.users = message.mentions.users.filter((u) => !u.bot);
  
  // If the message content is "/pay @Androz 10", the args will be : [ "pay", "@Androz", "10" ]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  // The command will be : "pay" and the args : [ "@Androz", "10" ]
  const command = args.shift().toLowerCase();
  
  var isAdmin = config.administrators.includes(message.author.id) || config.administrators.includes(message.author.tag);

  bot.on("guildMemberAdd", (member) => {
    
    let namesize = member.user.username.length;
    


    let channel = bot.channels.get('703239191538040942');
    
/*     channel.send(member.user + " **Olá, eu sou o BMO, o bot oficial da Noitosfera Community, preciso fazer 2 perguntas perguntinhas para melhorar suas experiência conosco. Responda com (sim, s) ou (não, n)**").then(
      function(message) {
        
      }); */
    });

    function reactcollector(message,author){
      message.react('👍').then(() => message.react('👎'));
      const filter = (reaction, user) => {
        return ['👍', '👎'].includes(reaction.emoji.name) && user.id === author;
      };
      message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first();
        
        if (reaction.emoji.name === '👍') {
          //message.reply("Resposta = Sim");
          bot.guilds.get('699806912602177607').members.get(author).addRole(Role1.id);
          message.channel.send("**Obrigado por sua atenção! Para responder novamente a essas perguntas basta digitar -bmonotifications no canal #BMO ou aqui mesmo no privado.**");
          message.delete();
        } else {
          //message.reply("Resposta = Não");
          message.channel.send("<@"+author +">"+ "\n**Deseja receber notificações no privado de nosso eventos e sorteios premiados semanais? (3 a 4 vezes por semana)**").then(message => {
        message.react('👍').then(() => message.react('👎'));
        const filter = (reaction, user) => {
          return ['👍', '👎'].includes(reaction.emoji.name) && user.id === author;
        };
        message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
          const reaction = collected.first();
          
          if (reaction.emoji.name === '👍') {
            //message.reply("Resposta = Sim");
            bot.guilds.get('699806912602177607').members.get(author).addRole(Role2.id);
            message.channel.send("**Obrigado por sua atenção! Para responder novamente a essas perguntas basta digitar -bmonotifications no canal #BMO ou aqui mesmo no privado.**");
            message.delete();
          } else {
            message.channel.send("**Obrigado por sua atenção! Para responder novamente a essas perguntas basta digitar -bmonotifications no canal #BMO ou aqui mesmo no privado.**");
            message.delete();
          }
      })
        })
        message.delete();
        }
      })
      .catch(collected => {
        message.delete();
      });
    }
    
    
    /* USER COMMANDS */
    
    switch(command){
      /**
      *  command "help"
      *  Display all the bot commands
      */
      case "testee":
/*       if(!isAdmin){
        return message.reply("você não pode executar este comando!");
      } */
      //console.log(message.author.id);
      //if(!message.guild.member(bot.user).hasPermission('MANAGE_ROLES')) return;
      let channel = bot.channels.get('507337882457997312');
      author = message.author.id;
      message.author.send(message.author + "\n**Olá, eu sou o BMO, o bot oficial da Noitosfera Community, preciso fazer 2 perguntinhas para melhorar suas experiência conosco. Responda com (sim, s) ou (não, n).**"+
      "\n\n**Você deseja receber notificações no privado de atualizações da nossa comunidade? (1 a 2 vezes por mês).**"
      ).then(message => {
        reactcollector(message,author);
      })
      break;
    }
    
  });