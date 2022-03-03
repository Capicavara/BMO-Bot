const Discord = require("discord.js");
const client = new Discord.Client();
var fs = require('fs');
const config = require("./config.json");
var cron = require("cron");
var today = new Date();
// Initialize the invite cache
var invites = {};
var convites = [];
var ids = [];
var idx = 0;
var promoters = [];
var nomes = [];
var aviso3 = [];
var convitesOld = require("./invites.json");
var aviso = require("./avisos.json");
// A pretty useful method to create a delay without blocking the whole script.
const wait = require('util').promisify(setTimeout);
console.log();
let menssagem1 = new cron.CronJob('00 00 18 * * *', () => {
    let channel =  client.guilds.get('212321202541297674').channels.get('507337882457997312');
    console.log('foi');
    aviso3 = [];
    convitesOld.forEach(paraCada)
});

let menssagem2 = new cron.CronJob('00 00 07 * * *', () => {
    //let promolist = [];
    const embed = new Discord.RichEmbed()
    .setTitle('Aviso diario teste')
    .setColor(0xFFFFFF)
    .setDescription(config.notifications['2']);
 /*    let promo = client.guilds.get('699806912602177607').roles.get('717298927505768448').members.map(m=>m.user.id);
    promo.forEach(element => {
        promolist.push('<@'+element+'>');
    }) */
    let channel =  client.guilds.get('212321202541297674').channels.get('507337882457997312');
    channel.send('<@717298927505768448>'); 
    channel.send(embed); 
});

let conviteCheck = new cron.CronJob('00 00 00 * * *', () => {
    convitesOld = require("./invites.json");
    convites = [];
    checkInvites();
});

/* let menssagem3 = new cron.CronJob('00 00 00 * * *', () => {
    let channel =  client.guilds.get('212321202541297674').channels.get('507337882457997312');
    channel.send('Menssagem massa');
}); */

let menssagem4 = new cron.CronJob('00 00 08 1 * *', () => {
    let channel =  client.guilds.get('212321202541297674').channels.get('507337882457997312');
    channel.send(config.notifications['3']);
});

/* let menssagem5 = new cron.CronJob('00 13 00 * * *', () => {
    let channel =  client.guilds.get('212321202541297674').channels.get('507337882457997312');
    channel.send('Menssagem massa');
}); */
conviteCheck.start();
menssagem1.start();
menssagem2.start();
//menssagem3.start();
menssagem4.start();
//menssagem5.start();
function checkInvites(){
    client.guilds.get('699806912602177607').fetchInvites().then(guildInvites => {
        const inviteCounter = {};
        invites = guildInvites;
        //console.log(guildInvites);
        invites.forEach((invite) => {
            const { uses, inviter } = invite
            const { username, discriminator, id } = inviter
            const name = `${id}`
            //console.log(uses,username,discriminator);
            inviteCounter[name] = (inviteCounter[name] || 0) + uses
        })
        let replyText = 'Invites:'
        
        const sortedInvites = Object.keys(inviteCounter).sort(
            (a, b) => inviteCounter[b] - inviteCounter[a]
            )
            
            //console.log(sortedInvites)
            
            //sortedInvites.length = 3
            
            for (const invite of sortedInvites) {
                idx = idx + 1
                const count = inviteCounter[invite]
                
                convites.push({
                    'id' : invite,
                    'quantidade' : count,
                });
                replyText += `\n${invite} Convidou ${count} membro(s)!`
            }
            //console.log(guildInvites);
            fs.writeFile("./invites.json", JSON.stringify(convites, null, 4), (err) => {
                if (err) {  console.error(err);  return; };
            });
            idx = 0;
            //client.channels.get('507337882457997312').send('teste');
        })
    }
    client.on('ready', () => {
        // "ready" isn't really ready. We need to wait a spell.
        wait(1000);
        checkInvites();
        console.log('Invites OK...');
        // Load all invites for all guilds and save them to the cache.

    })
    client.on("message", (message) => {
        if (message.content.startsWith("ping") && message.author.id === "242809867264327681") {
            convitesOld.forEach(paraCada);
            console.log('acabou');

        }
    });
    function avisoFor(element, index, array) {
        aviso[index].vezes = aviso[index].vezes + 1
        aviso[index].dias = aviso[index].dias + 1
    }
    function paraCada(element, index, array) {
        //console.log(client.guilds.get('699806912602177607').roles.get('717298927505768448').members.map(m=>m.user.id));
        //console.log(convites[index].id);
        

        if (element.quantidade <= convites[index].quantidade ){
            if (client.guilds.get('699806912602177607').members.get(convites[index].id) != undefined){
                if(client.guilds.get('699806912602177607').members.get(convites[index].id).roles.get('717298927505768448')){
                    promoters.push('<@'+convites[index].id+'>');
                    aviso3.push({
                        'id' : convites[index].id,
                        'vezes' : 0,
                        'dias' : 0
                    })
                    nomes.push(client.guilds.get('699806912602177607').members.get(convites[index].id).user.username);
                    //console.log(client.fetchUser(convites[index].id).tag);
                }
            }
        };
        if (index == convitesOld.length - 1){
            const membros = "**"+promoters.join()+"**";
            aviso.forEach(avisoFor);
            var nomess = nomes.join().toString();
            //console.log(nomes);
            const embed = new Discord.RichEmbed()
            .setTitle('Aviso diario teste')
            .setColor(0xFFFFFF)
            .setDescription(`**${nomess}**` + config.notifications['1']);
            client.guilds.get('212321202541297674').channels.get('507337882457997312').send(promoters.join());
            client.guilds.get('212321202541297674').channels.get('507337882457997312').send(embed);
            promoters = [];
            nomes = [];
            if(aviso[0].dias >= 3){
                //client.guilds.get('699806912602177607').members.get('242809867264327681').removeRole(client.guilds.get('699806912602177607').roles.get('717298927505768448'));
/*                 aviso.forEach(ind => {
                  console.log( );
                }) */
                fs.writeFile("./avisos.json", JSON.stringify(aviso3, null, 4), (err) => {
                    if (err) {  console.error(err);  return; };
                });
            }
            else{
                fs.writeFile("./avisos.json", JSON.stringify(aviso, null, 4), (err) => {
                    if (err) {  console.error(err);  return; };
                });
                aviso = require("./avisos.json");
            }
        }
    }
    client.login(config.token);