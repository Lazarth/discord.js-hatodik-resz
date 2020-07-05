const botconfig = require("./botconfig.json");
const tokenfile = require("./tokenfile.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
var figlet = require("figlet");

bot.on("ready", async () => {
    console.log(`${bot.user.username} online lett ${bot.guilds.size} szerveren!`);
    bot.user.setActivity("tutorial", {type: "LISTENING"});
});

bot.on("guildMemberAdd", function(member) {

    let ch = member.guild.channels.find(`name`, `welcome`);
    let r = member.guild.roles.find(`name`, `tag`);

    ch.send(`Üdvözlünk a szerveren **${member}**`);
    member.addRole(r.id);

});

bot.on("message", async message => {
    if(message.author.bot) return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let blacklist = ["szó1", "szó2", "szó3", "szó4"];
    //                 0       1        2

    try {
        for(let i = 0; i < blacklist.length; i++) {
            if(messageArray[i].toLowerCase().includes(blacklist[i], 0)) {
                message.delete();
                message.reply("Ez a szó tiltott!").then(r =>r.delete(5000));
                return;
            }
        }
    } catch(err) {
        
    }

    let embed = new Discord.RichEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL)
    .setFooter("Teszt - Bot", bot.user.avatarURL)
    .setTimestamp();

    // ###### PARANCSOK ######

    if(cmd == `${prefix}ascii`) {
        if(!args.join(" ")) {
            message.delete();
            return message.channel.send("Adj meg egy szöveget!").then(msg => msg.delete(5000));
        }
        figlet(args.join(" "), function(err, data) {
            if (err) return console.dir(err);
            message.channel.send(data, {
                code: 'md'
            });
        });
    }

    if(cmd == `${prefix}gamble`) {
        let sum = Math.floor(Math.random() * 6) + 1;

        embed.setColor("PURPLE");
        embed.addField("Szerencsejáték", `A mostani kidobott számod: ${sum}`);
        embed.addBlankField();

        if(sum == 1) embed.addField("Mostani szerencse:", "Nagyon balszerencsés voltál.");
        else if(sum < 3) embed.addField("Mostani szerencse:", "Balszerencsés voltál.");
        else if(sum < 5) embed.addField("Mostani szerencse:", "Átlagos.");
        else if(sum == 5) embed.addField("Mostani szerencse:", "Szerencsés voltál.");
        else embed.addField("Mostani szerencse:", "Nagyon szerencsés voltál.");

        message.channel.send(embed);
    }

});

bot.login(tokenfile.token);