const Discord = require("discord.js"), // npm install discord.js
ms = require("ms"), // npm install ms
Quickdb = require("quick.db"), // npm install Androz2091/quick.db
AsciiTable = require("ascii-table"); // npm install ascii-table
const { convertMs } = require("./functions.js");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./json.sqlite');
// Replace json.sqlite by the file name of your choice
Quickdb.init("./json.sqlite");
const GifCreationService = require('gif-creation-service');
var wkhtmltoimage = require('wkhtmltoimage');
fs = require('fs'), 
gm = require('gm');
var page = 0;
var htmlToGif = require('html-to-gif');
const utf8 = require('utf8');
var ide = [];
const querystring = require('querystring');
const request = require('request');
const system = require('system-commands');
const configu = require("./config.json");
require('./welcome.js');
require('./inviteManager.js');
db.each("SELECT * from shop", function(err, row) {
    ide.push(row.id);
});

/* Create tables */
const usersData = new Quickdb.Table("usersdata"),
cooldowns = {
    work:new Quickdb.Table("work"),
    rep:new Quickdb.Table("rep"),
    xp:new Quickdb.Table("xp")
};
const shopData = new Quickdb.Table("shop");
const config = require("./config.json"), // Load config.json file
functions = require("./functions.js"),
bot = new Discord.Client(); // Create the discord Client

bot.login(config.token); // Discord authentification

bot.on("ready", () => { // When the bot is ready
    bot.user.setActivity(config.game);
    console.log("Tudo pronto!");
    console.log(bot.guilds.size+" servers, "+bot.users.size+" membros "+bot.channels.size+" salas");
});

bot.on("guildMemberAdd", (member) => {
    
    let namesize = member.user.username.length;
    
    wkhtmltoimage.generate('http://104.41.49.251/welcome.php?name='+member.user.username+"&disc="+member.user.discriminator+"&img="+member.user.displayAvatarURL+"&size="+namesize, { output: '/var/www/html/images/out.png' }, function (code, signal) {
    let channel = bot.channels.get('703239191538040942');
    gm("http://104.41.49.251/images/out.png").transparent('#36393e').write('/var/www/html/images/out.png', function (err) {
    if (err) console.log('aaw, shucks ' + err);
    else{
        channel.send(member.user + " **Seja bem vindo (a) a Noitosfera!\nRegistre-se em <#703672508917874810> e leia as <#703238936708776029>**", {files: ["http://104.41.49.251/images/out.png"]}).then(
        function(message) {
            message.react("👋");
        }
        );
    }
});
});
});
bot.on("message", (message) => {
    
    // If the message comes from a bot, cancel
    if(message.author.bot || !message.guild){
        return;
    }
    
    // If the message does not start with the prefix, cancel
    if(!message.content.startsWith(config.prefix)){
        return;
    }
    
    // Update message mentions
    message.mentions.members = message.mentions.members.filter((m) => !m.user.bot);
    message.member.users = message.mentions.users.filter((u) => !u.bot);
    
    // If the message content is "/pay @Androz 10", the args will be : [ "pay", "@Androz", "10" ]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    // The command will be : "pay" and the args : [ "@Androz", "10" ]
    const command = args.shift().toLowerCase();
    
    // Get the current message author information or create a new default profile
    var authorData = usersData.get(message.author.id) || functions.createUser(message.author, usersData);
    
    var membersData = []; // Initialize a new empty array
    
    if(message.mentions.members.size > 0){ // If some members are mentionned
        message.mentions.members.forEach((member) => { // For each member
            // Get the current member information or create a new default profile
            var memberData = usersData.get(member.id) || functions.createUser(member.user, usersData);
            membersData.push(memberData);
        });
    }
    
    // updates the user data by adding xp
    functions.updateXp(message, authorData, [usersData, cooldowns.xp]);
    
    // Check if the member is an administrator
    var isAdmin = config.administrators.includes(message.author.id) || config.administrators.includes(message.author.tag);
    
    /* USER COMMANDS */
    
    switch(command){
        /**
        *  command "help"
        *  Display all the bot commands
        */
        case "helppppp":
        var helpEmbed = new Discord.RichEmbed() // Creates a new rich embed (see https://discord.js.org/#/docs/main/stable/class/RichEmbed)
        .setAuthor("Bem-Vindo, "+message.author.username+"#"+message.author.discriminator, message.author.displayAvatarURL)
        .setDescription("**Lembrete** : `()` significa parametro opcional e `[]` parametro obrigatório")
        .addField("👑 Comandos Administrativos", // Sets the title of the field
        "**"+config.prefix+"create-item (nome)** - Crie um item!\n"+
        "**"+config.prefix+"edit-item (ID do item) (opções) [texto] ** - Edite um item!\n"+
        "**"+config.prefix+"give-item (ID do item) [@cargo | @membro] ** - De um item para um usuário!\n"+
        "**"+config.prefix+"remove-item (ID do item) [@cargo | @membro | loja] ** - Remova um item de um usuário!\n"+
        "**"+config.prefix+"remove-all [@cargo | @membro | loja] ** - Remova todos os items de um usuário!\n"+
        "**"+config.prefix+"setcredits [@membro] [nome]** - Altera o número de créditos do membro mencionado !\n"+
        "**"+config.prefix+"premium [@membro]** - Adicione ou remova um usuário com o passe premium !\n"
        //"**"+config.prefix+"cooldown [work/rep] [@membre]** - Resete cooldown de um comando de um membro !"
        )
        .addField("👨 Comandos", // Sets the title of the field
        "**"+config.prefix+"profile (@membro)** - Exibe perfil de um membro!\n"+
        "**"+config.prefix+"stock** - Exibir e administrar seus items!\n"+
        "**"+config.prefix+"comprar-item (ID)** - Compra um item!\n"+
        "**"+config.prefix+"vender-item (ID)** - Vende um item!\n"+
        //"**"+config.prefix+"work** - Trabalhe e ganhe créditos !\n"+
        "**"+config.prefix+"loja** - Exibe a loja do servidor!\n"+
        //"**"+config.prefix+"rep [@membre]** - Dê pontos de reputação para um membro !\n"+
        "**"+config.prefix+"setbio [texto]** - Mude sua bio !\n"+
        "**"+config.prefix+"pay [@membro] [quantidade]** - Pague um membro !\n"
        //"**"+config.prefix+"leaderboard** - Exibe a tabela de classificação !\n"
        )
        .setColor(config.embed.color) // Sets the color of the embed
        .setFooter(config.embed.footer) // Sets the footer of the embed
        .setTimestamp();
        
        message.channel.send(helpEmbed); // Send the embed in the current channel
        break;
        
        case "create-item":
        if(!isAdmin){
            return message.reply("você não pode executar este comando!");
        }
        var nome = args[0];
        var value = args[1];
        var descr = args[2];
        
        if(!nome){
            return message.reply("Você deve digitar um nome para o item!");
        }
        else if (!value){
            return message.reply("Você deve digitar um valor para o item!");
        }
        else if (!descr){
            return message.reply("Você deve digitar uma descrissão para o item!");
        }
        else if (!args[3]){
            return message.reply("Você deve digitar uma raridade para o item!");
        }
        else if (!args[4]){
            return message.reply("Você deve digitar a quantidade de estoque para o item!");
        }
        else if (!args[5]){
            return message.reply("Você deve digitar a quantidade de tempo para o item!");
        }
        else if (!args[6]){
            return message.reply("Você deve inserir um icone para o item!");
        }
        shopData.set(nome, {
            price:value,
            desc:descr,
            rarity:args[3],
            stock:args[4],
            time:args[5],
            icone:args[6] 
        });
        var helpEmbed = new Discord.RichEmbed() // Creates a new rich embed (see https://discord.js.org/#/docs/main/stable/class/RichEmbed)
        .addField("Comando em construção", // Sets the title of the field
        "Item "+nome+" criado com sucesso\n"
        )
        .addField("Detalhes",
        "Nome: " + nome + ".\n"+
        "Valor: " + value + ".\n"+
        "Descrição: " + descr + ".\n"+
        "Raridade: " + args[3] + ".\n"+
        "Quantidade em estoque: " + args[4] + ".\n"+
        "tempo disponível: " + args[5] + ".\n"
        )
        .setColor(config.embed.color) // Sets the color of the embed
        .setFooter(config.embed.footer) // Sets the footer of the embed
        .setTimestamp();
        
        message.channel.send(helpEmbed); // Send the embed in the current channel
        ide = [];
        db.each("SELECT * from shop", function(err, row) {
            ide.push(row.id);
        });
        break;
        
        case "edit-item":
        if(!isAdmin){
            return message.reply("você não pode executar este comando!");
        }
        ide = [];
        if (args[1] == 'nome'){
            db.run('UPDATE shop SET id="'+args[2]+'" WHERE id="'+args[0]+'"');
            message.channel.send('Item editado com sucesso');
            db.each("SELECT * from shop", function(err, row) {
                ide.push(row.id);
            });
        }
        else{
            shopData.set(args[0]+'.'+args[1],args[2]);      
            message.channel.send('Item editado com sucesso'); // Send the embed in the current channel
            db.each("SELECT * from shop", function(err, row) {
                ide.push(row.id);
            });
        }
        
        break;
        
        case "loja":
        var teste = [];
        ide.forEach(element =>{
            teste.push({
                name: element,
                value: shopData.get(element+'.price')
            })
            //console.log(teste);
        })
        message.channel.send({embed: {
            color: 3447003,
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
            },
            title: "Loja do servidor",
            description: "Esta é a loja do servidor, atualmente em desenvolvimento",
            fields: teste,
            timestamp: new Date(),
            footer: {
                text: "Em desenvolvimento"
            }
        }
    });
    break;
    
    case "remove-item":
    var helpEmbed = new Discord.RichEmbed() // Creates a new rich embed (see https://discord.js.org/#/docs/main/stable/class/RichEmbed)
    .addField("Comando em construção" // Sets the title of the field
    )
    .setColor(config.embed.color) // Sets the color of the embed
    .setFooter(config.embed.footer) // Sets the footer of the embed
    .setTimestamp();
    
    message.channel.send(helpEmbed); // Send the embed in the current channel
    break;
    
    case "remove-all":
    var helpEmbed = new Discord.RichEmbed() // Creates a new rich embed (see https://discord.js.org/#/docs/main/stable/class/RichEmbed)
    .addField("Comando em construção" // Sets the title of the field
    )
    .setColor(config.embed.color) // Sets the color of the embed
    .setFooter(config.embed.footer) // Sets the footer of the embed
    .setTimestamp();
    
    message.channel.send(helpEmbed); // Send the embed in the current channel
    break;
    
    case "stock":
    var helpEmbed = new Discord.RichEmbed() // Creates a new rich embed (see https://discord.js.org/#/docs/main/stable/class/RichEmbed)
    .addField("Comando em construção" // Sets the title of the field
    )
    .setColor(config.embed.color) // Sets the color of the embed
    .setFooter(config.embed.footer) // Sets the footer of the embed
    .setTimestamp();
    
    message.channel.send(helpEmbed); // Send the embed in the current channel
    break;
    
    case "comprar-item":
    var helpEmbed = new Discord.RichEmbed() // Creates a new rich embed (see https://discord.js.org/#/docs/main/stable/class/RichEmbed)
    .addField("Comando em construção" // Sets the title of the field
    )
    .setColor(config.embed.color) // Sets the color of the embed
    .setFooter(config.embed.footer) // Sets the footer of the embed
    .setTimestamp();
    
    message.channel.send(helpEmbed); // Send the embed in the current channel
    break;
    
    case "vender-item":
    var helpEmbed = new Discord.RichEmbed() // Creates a new rich embed (see https://discord.js.org/#/docs/main/stable/class/RichEmbed)
    .addField("Comando em construção" // Sets the title of the field
    )
    .setColor(config.embed.color) // Sets the color of the embed
    .setFooter(config.embed.footer) // Sets the footer of the embed
    .setTimestamp();
    
    message.channel.send(helpEmbed); // Send the embed in the current channel
    break;
    
    case "teste":
    
    /*     let namesize = message.author.username.length
    wkhtmltoimage.generate('http://104.41.49.251/store.php', { output: '/var/www/html/images/out.png' }, function (code, signal) {
    gm("http://104.41.49.251/images/store.png").transparent('#36393e').write('/var/www/html/images/out.png', function (err) {
    if (err) console.log('aaw, shucks' + err);
    else{
        message.channel.send(message.author + " **Seja bem vindo (a) a Noitosfera!\nRegistre-se em <#703672508917874810> e leia as <#703238936708776029>**",{files: ["http://104.41.49.251/images/out.png"]}).then(
        function(message) {
            message.react("👋")
        }
        );
    }
});

}); */

/* system('webgif -u http://104.41.49.251/store.php -d 2 -o /var/www/html/images/store/BMO.gif').then(output => {
console.log(output);
message.channel.send({files: ["http://104.41.49.251/images/store/BMO.gif"]})
}).catch(error => {
    console.error(error);
}) */

//ANCHOR para gif

/* const pngImages = [];
for (var i = 1; i <= 30; i++) {
    pngImages.push('/var/www/html/images/store/frames/output/bmo'+i+'.png')
}
console.log(pngImages);
const outputGifFile = '/var/www/html/images/store/frames/output.gif';

GifCreationService.createAnimatedGifFromPngImages(pngImages, outputGifFile, {repeat: true, fps: 10, quality: 10})
.then(outputGifFile => {
    console.log(`Alright, GIF ${outputGifFile} created!`);
}); */
function reactcollector(message,page,author){
    if(page == 0){
        message.react('⏩')
    }
    else if(page > 0 && page < Math.round(ide.length / 3)){
        message.react('⏪').then(() => message.react('⏩'));
    }
    else{
        message.react('⏪')
    }
    const filter = (reaction, user) => {
        return ['⏩', '⏪'].includes(reaction.emoji.name) && user.id === author;
    };
    message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();
        
        if (reaction.emoji.name === '⏩') {
            page = page+1;          
            message.delete();
            message.channel.send({files: ["/var/www/html/images/store/frames/output/saida"+page.toString()+".gif"]}).then(message =>{
                reactcollector(message,page,author);
                //gerarImagens(page);
            })
        } else {
            page = page-1;
            message.delete();
            message.channel.send({files: ["/var/www/html/images/store/frames/output/saida"+page.toString()+".gif"]}).then(message =>{
                reactcollector(message,page,author);
            })
        }
    })
    .catch(collected => {
        message.delete();
    });
}

function gerarImagens(page){
    const pngImages = [];
    const data = [];
    for (var x = 0; x < ide.length; x++){
        data.push(
            {
                "item" : ide[x],
                "price" : shopData.get(ide[x]+'.price'),
                "stock" : shopData.get(ide[x]+'.stock'),
                "desc" : shopData.get(ide[x]+'.desc'),
                "time" : shopData.get(ide[x]+'.time'),
                "img" : shopData.get(ide[x]+'.icone')
            }
            );
        }
        
        
        request.post({
            url:     'http://104.41.49.251/store2.php',
            form:    { data: data }
        }, function(error, response, body){
            // console.log(body);
            for (var i = 1; i <= 30; i++) {
                wkhtmltoimage.generate('http://104.41.49.251/store2.php?bmo='+i+'&pagina='+page, { output: '/var/www/html/images/store/frames/output/out'+i+'.png' });   
                pngImages.push('http://104.41.49.251/images/store/frames/output/out'+i+'.png');
            }
            gm()
            .limit('memory', '3000MB')
            .limit('map', '3000MB')
            .in(pngImages[0])
            .in(pngImages[1])
            .in(pngImages[2])
            .in(pngImages[3])
            .in(pngImages[4])
            .in(pngImages[5])
            .in(pngImages[6])
            .in(pngImages[7])
            .in(pngImages[8])
            .in(pngImages[9])
            .in(pngImages[10])
            .in(pngImages[11])
            .in(pngImages[12])
            .in(pngImages[13])
            .in(pngImages[14])
            .in(pngImages[15])
            .in(pngImages[16])
            .in(pngImages[17])
            .in(pngImages[18])
            .in(pngImages[19])
            .in(pngImages[20])
            .in(pngImages[21])
            .in(pngImages[22])
            .in(pngImages[23])
            .in(pngImages[24])
            .in(pngImages[25])
            .in(pngImages[26])
            .in(pngImages[27])
            .in(pngImages[28])
            .in(pngImages[29])
            .quality(100)
            .delay(12)
            .strip()
            .scale(500, 480)
            .monitor()
            .write("/var/www/html/images/store/frames/output/saida"+page.toString()+".gif", function(err){
                if (err) throw err;
                console.log("animated.gif created");
                if (page != 0){
                    message.channel.send({files: ["/var/www/html/images/store/frames/output/saida"+page.toString()+".gif"]}).then( message => {
                        reactcollector(message, page);
                    })      
                }
            });
        });
        author = message.author.id;
        if(page == 0){
            message.channel.send({files: ["/var/www/html/images/store/frames/output/saida"+page.toString()+".gif"]}).then( message => {
                reactcollector(message, page, author);
            })
        }
        
    }
    page = 0;
    if (args[0] == undefined){
        gerarImagens(0);
    }
    else{
        gerarImagens(parseInt(args[0]));
    }
    // Send the embed in the current channel
    break;
    
    /**
    *  command "profile"
    *  Display the profile of the message author or the profile of the first mentionned members
    */
    case "profile":
    // Gets the guildMember whose profile you want to display
    var member = message.mentions.members.size > 0 ? message.mentions.members.first() : message.member;
    
    // Check if the member is a bot
    if(member.user.bot){
        return message.reply("bots não têm perfil!");
    }
    
    // Gets the data of the guildMember whose profile you want to display
    var data = (message.member === member) ? authorData : membersData[0];
    
    var profileEmbed = new Discord.RichEmbed() // Creates a new rich embed (see https://discord.js.org/#/docs/main/stable/class/RichEmbed)
    .setAuthor("Perfil de "+member.user.username+" !", member.user.displayAvatarURL) // Sets the heading of the embed
    // if the member has a description, display them, else display "Aucune description enregistrée !"
    .setDescription(data.desc !== "unknow" ? data.desc : "Nenhuma biografia adicionada!")
    // Display the amount of credits of the member
    .addField("💰 Gold", "**"+data.credits+"** gold(s)", true)
    // Display the amount of reputation points of the member
    .addField("🎩 Reputação", "**"+data.rep+"** pontos(s)", true)
    // If the member is premium, display "Oui !" else display "Non..."
    .addField("👑 Premium", ((data.premium === "true") ? "Sim!" : "Não..."), true)
    // Display the creation date of the member
    .addField("📅 Registro", "em "+data.registeredAt, true)
    // Display the level of the member
    .addField("📊 Nivel", "**"+data.level+"**", true)
    // Display the xp of the member
    .addField("🔮 Experiência", "**"+data.xp+"** xp", true)
    .setColor(config.embed.color) // Sets the color of the embed
    .setFooter(config.embed.footer) // Sets the footer of the embed
    .setTimestamp();
    
    message.channel.send(profileEmbed); // Send the embed in the current channel
    break;
    
    /**
    *  command "setbio"
    *  Update user biography with the text sent in args
    */
    case "setbio":
    var bio = args.join(" "); // Gets the description 
    console.log(args.join(" "));
    // if the member has not entered a description, display an error message
    if(!bio){
        return message.reply("Digite uma biografia!");
    }
    // if the description is too long, display an error message 
    if(bio.length > 100){
        return message.reply("Sua descrissão nao pode exeder 100 caracteres!");
    }
    
    // save the description in the database
    usersData.set(message.author.id+".bio", bio);
    
    // Send a success message
    message.reply("sua descrissão acabou de ser atualizada!");
    break;
    
    /**
    *  command "pay"
    *  Send credits to a member
    */
    case "pay":
    // Gets the first mentionned member
    var member = message.mentions.members.first();
    // if doesn't exist, display an error message
    if(!member){
        return message.reply("Você deve mencionar um membro!");
    }
    
    // if the user is a bot, cancel
    if(member.user.bot){
        return message.reply("você não pode pagar um bot!");
    }
    
    // check if the receiver is the sender
    if(member.id === message.author.id){
        return message.reply("você não pode se pagar!");
    }
    
    // gets the amount of credits to send
    var amountToPay = args[1];
    // if the member has not entered a valid amount, display an error message
    if(!amountToPay){
        return message.reply("você deve inserir um valor a ser pago para **"+member.user.username+"** !");
    }
    if(isNaN(amountToPay) || amountToPay < 1){
        return message.reply("Quantidade inválida.");
    }
    // if the member does not have enough credits
    if(amountToPay > authorData.credits){
        return message.reply("você não possui créditos suficientes para concluir esta transação!");
    }
    
    // Adding credits to the receiver
    usersData.add(member.id+".credits", amountToPay);
    // Removes credits from the sender
    usersData.subtract(message.author.id+".credits", amountToPay);
    
    // Send a success message
    message.reply("transação concluída.");
    break;
    
    /**
    *  command "work"
    *  Win credits by using work command every six hours
    */
    case "work":
    
    // if the member is already in the cooldown db
    var isInCooldown = cooldowns.work.get(message.author.id);
    if(isInCooldown){
        /*if the timestamp recorded in the database indicating 
        when the member will be able to execute the order again 
        is greater than the current date, display an error message */
        if(isInCooldown > Date.now()){
            let delay = functions.convertMs(isInCooldown - Date.now()); 
            return message.reply("você deve esperar "+ delay +" antes de poder trabalhar novamente!");
        }
    }
    
    // Records in the database the time when the member will be able to execute the command again (in 6 hours)
    var towait = Date.now() + ms("6h");
    cooldowns.work.set(message.author.id, towait);
    
    // Salary calculation (if the member is premium, the salary is doubled)
    var salary = (authorData.premium === "true") ? 400 : 200;
    
    // Add "premium" if the member is premium
    var heading = (authorData.premium === "true") ? "Salário premium recuperado! ":" Salário recuperado!";
    
    var embed = new Discord.RichEmbed() // Creates a new rich embed
    .setAuthor(heading) // sets the heading of the embed
    .setDescription(salary+" créditos adicionados ao seu perfil!")
    .setFooter("Para membros premium, o salário é dobrado!")
    .setColor(config.embed.color) // Sets the color of the embed
    .setTimestamp();
    
    // Update user data
    usersData.add(message.author.id+".credits", salary);
    
    // Send the embed in the current channel
    message.channel.send(embed);
    break;
    
    /**
    *  command "rep"
    *  Give a reputation point to a member to thank him
    */
    case "rep":
    // if the member is already in the cooldown db
    var isInCooldown = cooldowns.rep.get(message.author.id);
    if(isInCooldown){
        /*if the timestamp recorded in the database indicating 
        when the member will be able to execute the order again 
        is greater than the current date, display an error message */
        if(isInCooldown > Date.now()){
            let delay = functions.convertMs(isInCooldown - Date.now()); 
            return message.reply("você deve esperar por "+ delay +" antes de poder executar este comando novamente!");
        }
    }
    
    // Gets the first mentionned member
    var member = message.mentions.members.first();
    // if doesn't exist, display an error message
    if(!member){
        return message.reply("você deve mencionar um membro!");
    }
    
    // if the user is a bot, cancel
    if(member.user.bot){
        return message.reply("você não pode dar um ponto de reputação a um bot!");
    }
    
    // if the member tries to give himself a reputation point, dispaly an error message
    if(member.id === message.author.id){
        return message.reply("você não pode se dar um ponto de reputação!");
    }
    
    // Records in the database the time when the member will be able to execute the command again (in 6 hours)
    var towait = Date.now() + ms("6h");
    cooldowns.rep.set(message.author.id, towait);
    
    // Update member data 
    usersData.add(member.id+".rep", 1);
    
    // send a success message in the current channel
    message.reply("você deu a ** "+ member.user.username +" ** um ponto de reputação!");
    break;
    
    /**
    *  command "leaderboard"
    *  Displays the players with the most amount of credits 
    */
    case "leaderboard":
    // Creates a new empty array
    var leaderboard = [];
    
    // Fetch all users in the database and for each member, create a new object
    usersData.fetchAll().forEach((user) => {
        // if the user data is not an array, parse the user data
        if(typeof user.data !== "object"){
            user.data = JSON.parse(user.data);
        }
        // Push the user data in the empty array
        leaderboard.push({
            id:user.ID,
            credits:user.data.credits,
            rep:user.data.rep
        });
    });
    
    // Sort the array by credits
    leaderboard = functions.sortByKey(leaderboard, "credits");
    // Resize the leaderboard
    if(leaderboard.length > 20){
        leaderboard.length = 20;
    }
    
    // Creates a new ascii table and set the heading
    var table = new AsciiTable("LEADERBOARD").setHeading("", "Utilizador", "Dinheiro", "Reputação");
    
    // Put all users in the new table
    functions.fetchUsers(leaderboard, table, bot).then((newTable) => {
        // Send the table in the current channel
        message.channel.send("```"+newTable.toString()+"```");
    });
    break;
    
    /* ADMIN COMMANDS */
    
    /**
    *  command "setcredits"
    *  Sets the amount of credits to the mentionned user
    */
    
    case "setcredits":
    // if the user is not an administrator
    if(!isAdmin){
        return message.reply("você não pode executar este comando!");
    }
    
    // Gets the first mentionned member
    var member = message.mentions.members.first();
    // if doesn't exist, display an error message
    if(!member){
        return message.reply("você deve mencionar um membro!");
    }
    
    // if the user is a bot, cancel
    if(member.user.bot){
        return message.reply("você não pode dar créditos a um bot!");
    }
    
    // gets the amount of credits to send
    var toAdd = args[1];
    // if the member has not entered a valid amount, display an error message
    if(isNaN(toAdd) || !toAdd){
        return message.reply("você deve inserir um valor para ** "+ member.user.username +" **!");
    }
    
    // Update user data
    usersData.set(member.id+".credits", parseInt(toAdd, 10));
    
    // Send success message in the current channel
    message.reply("créditos definidos em ** "+ toAdd +" ** para ** "+ member.user.username +" **!");
    break;
    
    /**
    *  command "premium"
    *  Sets the member premium or not
    */
    case "premium":
    // if the user is not administrator
    if(!isAdmin){
        return message.reply("você não pode executar este comando!");
    }
    
    // Gets the first mentionned member
    var member = message.mentions.members.first();
    // if doesn't exist, display an error message
    if(!member){
        return message.reply("você deve mencionar um membro!");
    }
    
    // if the user is a bot, cancel
    if(member.user.bot){
        return message.reply("você não pode passar um bot premium!");
    }
    
    // If the mentionned member isn"t premium
    if(membersData[0].premium === "false"){
        // Update user data
        usersData.set(member.id+".premium", "true");
        // sends a message of congratulations in the current channel
        message.channel.send(": tada: Parabéns "+ membro +"! Agora você é um usuário premium!");
    } 
    else { // if the member is premium
        // Update user data
        usersData.set(member.id+".premium", "false");
        // send a message in the current channel
        message.channel.send(":confused: Muito ruim "+ membro +" ... Você não faz mais parte dos membros premium!");
    }
    break;
    
    case "embed-1":
    if(!isAdmin){
        return message.reply("você não pode executar este comando!");
    }
    configu.notifications['1'] = args.join(` `);
    fs.writeFile("./config.json", JSON.stringify(configu, null, 4), (err) => {
        if (err) {  console.error(err);  return; };
        message.channel.send("Notificação editada com sucesso");
    });
    
    break;
    
    case "embed-2":
    if(!isAdmin){
        return message.reply("você não pode executar este comando!");
    }
    configu.notifications['2'] = args.join(" ");
    fs.writeFile("./config.json", JSON.stringify(configu, null, 4), (err) => {
        if (err) {  console.error(err);  return; };
        message.channel.send("Notificação editada com sucesso");
    });
    
    break;
    
    case "embed-3":
    if(!isAdmin){
        return message.reply("você não pode executar este comando!");
    }
    configu.notifications['3'] = args.join(" ");
    fs.writeFile("./config.json", JSON.stringify(configu, null, 4), (err) => {
        if (err) {  console.error(err);  return; };
        message.channel.send("Notificação editada com sucesso");
    });
    
    break;
    
    case "embed-4":
    if(!isAdmin){
        return message.reply("você não pode executar este comando!");
    }
    configu.notifications['4'] = args.join(" ");
    fs.writeFile("./config.json", JSON.stringify(configu, null, 4), (err) => {
        if (err) {  console.error(err);  return; };
        message.channel.send("Notificação editada com sucesso");
    });
    
    break;
    
    case "embed-5":
    if(!isAdmin){
        return message.reply("você não pode executar este comando!");
    }
    configu.notifications['5'] = args.join(" ");
    fs.writeFile("./config.json", JSON.stringify(configu, null, 4), (err) => {
        if (err) {  console.error(err);  return; };
        message.channel.send("Notificação editada com sucesso");
    });
    
    break;
    
    
    
    /**
    *  command "cooldown"
    *  Reset the cooldown of the member for the command
    */
    case "cooldown":
    // if the user is not administrator
    if(!isAdmin){
        return message.reply("você não pode executar este comando!");
    }
    
    // Gets the command 
    var cmd = args[0];
    // if the command is not rep or work or there is no command, display an error message
    if(!cmd || ((cmd !== "rep") && (cmd !== "work"))){
        return message.reply("digite um comando válido (rep ou work)!");
    }
    
    // Gets the first mentionned member
    var member = message.mentions.members.first();
    // if doesn't exist, display an error message
    if(!member){
        return message.reply("você deve mencionar um membro!");
    }
    
    // if the user is a bot, cancel
    if(member.user.bot){
        return message.reply("você não pode redefinir a recarga de um bot!");
    }
    
    // Update cooldown db
    cooldowns[cmd].set(member.id, 0);
    
    // Send a success message
    message.reply("o ** "+ member.user.username +" ** recarga para o comando ** "+ cmd +" ** foi redefinido!");
    break;
}

});
