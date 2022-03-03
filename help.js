const { MessageEmbed } = require("discord.js")

module.exports.run = async (client, message, args) => {

message.delete()
const help = new MessageEmbed()
.setAuthor(client.user.username, client.user.displayAvatarURL())
.setColor("#bb00ff") //a cor que você quiser aqui 
.setTitle(" <a:purple_flame:729766804725039137> RANGER - Painel de ajuda <a:purple_flame:729766804725039137> ")
.setDescription(`**Como posso te ajudar?**
\n**Ajuda e Informações**
Reaja com <a:lupa:729766805245263982> para saber um pouco mais sobre mim e como posso lhe ser útil.
\n**Comandos**
\n<:circle_1:730106218676224056> ⟫ Moderação\n<:circle_2:730106218856710194> ⟫ Utilitários\n<:circle_3:730106219284660375> ⟫ Diversão\n<:music:730198317203587183> ⟫ Música`)
.setImage(`https://i.pinimg.com/564x/56/4a/4e/564a4ee148cba6a748b466c606c7d966.jpg`)
.addField("links", '<a:purple_flame:729766804725039137>**[Me adicione](https://discordapp.com/oauth2/authorize?client_id=727557535623544943&scope=bot&permissions=8)**<a:purple_flame:729766804725039137>')
.setThumbnail(`https://gamepedia.cursecdn.com/fortnite_gamepedia/thumb/b/bf/Fallen_Love_Ranger_Spray.png/256px-Fallen_Love_Ranger_Spray.png?version=0acf22b034d6267fc89c9ec537cfdf7b`)

message.reply(help)
 .then(msg => {
msg.react("730204347216167024")//esse primeiro vai ser a flecha de voltar
msg.react("729766805245263982")//da aba de muderação
msg.react("730106218676224056")//seria pro de diversao
msg.react("730106218856710194")//seria pro de economia
msg.react("730106219284660375")//Puxar a reação do primeiro emoji com o coletor e responder em outra aba
msg.react("730198317203587183") 
let fbac = (react, user) => react.emoji.name === "arrow_purple0" && user.id !== client.user.id;// no emoji aqui pode ser o proprio emoji se for do discord ja, ou o nome dele se for personalizado
 
 
 let bcoletor = msg.createReactionCollector(fbac, {time: 120000})
 
 bcoletor.on('collect', back => {
 msg.edit(help)
 })

 
 let afiltro = (react, user) => react.emoji.name === "lupa" && user.id === message.author.id;// no emoji aqui pode ser o proprio emoji se for do discord ja, ou o nome dele se for personalizado
 
 let acoletor = msg.createReactionCollector(afiltro, {time: 120000})
acoletor.on('collect', am => {
const adm = new MessageEmbed()
.setColor("#bb00ff")// da sua preferência
.setTitle("<:heart2:730207443929268285> SOBRE MIM <:heart2:730207443929268285>")
.setDescription(`Quer saber mais sobre mim ? então você veio para o lugar certo!\n\nEu fui criado pelo \`꧁༒ⱤɆ₳₱ɆⱤ Ø₣ ĐɆ₳₮Ⱨ༒꧂#5226 \`\nmas estou no servidor para ajuda-lo na Moderação do servidor e também para entreter os demais Membros <3 .`)
msg.edit(adm)
})

let cfiltro = (react, user) => react.emoji.name === "circle_1" && user.id === message.author.id;// no emoji aqui pode ser o proprio emoji se for do discord ja, ou o nome dele se for personalizado

let ccoletor = msg.createReactionCollector(cfiltro, {time: 120000})
ccoletor.on('collect', bm => {
const adm = new MessageEmbed()
.setColor("#bb00ff")// da sua preferência
.setTitle("painel - Moderação")
.setDescription(`**comandos - Mod.**\n\nkick\n\`como usar ≫ r!kick <@user>\`\nban\n\`como usar ≫ r!ban <@user>\`\nmute\n\`como usar ≫ r!mute <tempo> <@user>\`\nlock\n\`como usar ≫ r!lock <on/off>.\`\nslownmode\n\`como usar ≫ r!slownmode <seg/min/horas>\`\nclear\n\`como usar ≫ r!clear <num. de mensagens a serem apagadas>(max. 99)\`\nsay\n\`como usar ≫ r!say <frase>\``)
msg.edit(adm)
})

let dfiltro = (react, user) => react.emoji.name === "circle_2" && user.id === message.author.id;// no emoji aqui pode ser o proprio emoji se for do discord ja, ou o nome dele se for personalizado

let dcoletor = msg.createReactionCollector(dfiltro, {time: 120000})
dcoletor.on('collect', cm => {
const adm = new MessageEmbed()
.setColor("#bb00ff")// da sua preferência
.setTitle("Painel - Utilitários")
.setDescription(`**comandos - Uteis**\n\najuda\n\`como usar ≫ r!ajuda\`\nping\n\`como usar ≫ r!ping\`\nuptime\n\`como usar ≫ r!uptime\`\nserver-info\n\`como usar ≫ r!server-info\`\nenquete\n\`como usar ≫ r!enquete <enquete>\`\nwikis\n\`como usar ≫ r!wikis <comando>\`\ngiveawey\n\`como usar ≫ r!giveawey <tempo> <canal> <prêmio> EM FASE BETA\``)
.setImage(``)
msg.edit(adm)
})

let efiltro = (react, user) => react.emoji.name === "circle_3" && user.id === message.author.id;// no emoji aqui pode ser o proprio emoji se for do discord ja, ou o nome dele se for personalizado

let ecoletor = msg.createReactionCollector(efiltro, {time: 120000})
ecoletor.on('collect', cm => {
const diver = new MessageEmbed()
.setColor("#bb00ff")// da sua preferência
.setTitle("painel - Diversão")
.setDescription(`**comandos - funny**\n\nmemes\n\`como usar ≫ r!memes\`\nkiss\n\`como usar ≫ r!kiss <@user>\`\nslap\n\`como usar ≫ r!slap <@user>\`\nhug\n\`como usar ≫ r!hug <@user>\`\n8ball\n\`como usar ≫ r!8ball <pergunta>\`\njokempo\n\`como usar ≫ r!jokempo <pedra/papel/tesoura>\`\nforca\n\`como usar ≫ r!forca\`\nroleta-russa\n\`como usar ≫ r!roleta-russa\`\ncoinflip\n\`como usar ≫ r!coinflip <cara/coroa>\`\nachievement\n\`como usar ≫ r!achievement <conquista>.\``)
msg.edit(diver)
})

let ffiltro = (react, user) => react.emoji.name === "music" && user.id === message.author.id;// no emoji aqui pode ser o proprio emoji se for do discord ja, ou o nome dele se for personalizado

let fcoletor = msg.createReactionCollector(ffiltro, {time: 120000})
fcoletor.on('collect', cm => {
const diver = new MessageEmbed()
.setColor("#bb00ff")// da sua preferência
.setTitle("painel - Música")
.setDescription(`**comandos - music**\n\n\`EM BREVE!\``)
msg.edit(diver)
})
//Apartir daqui faça as outras abas conforme a de moderação
//Coloquei 4 reações, a primeira é pra voltar e as outras 3 : uma pra aba de moderação, outra pra aba de diversão e outro pra economia
})
}