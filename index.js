const discord = require('discord.js');
const client = new discord.Client();
require('dotenv').config();
require('./DinoTools/eventLoader.js')(client);
const request = require("request");
const gm = require("gm").subClass({
    imageMagick: true
  });
const repeat = require('repeat');
const fs = require('fs');
const Filter = require('bad-words');

const filter = new Filter();
const prefix = "##";

var guildData = JSON.parse(fs.readFileSync('./Data Files/guilds.json', 'utf8'))
var userData = JSON.parse(fs.readFileSync('./Data Files/userData.json', 'utf8'))

client.login(process.env.dinoTK)

client.on('message', message => {
    var sender = message.author;
    var guild = message.guild;

    if(message.channel.type == 'dm')return;

    if(!userData[sender.id]) userData[sender.id] = {
        tag: sender.tag,
        coins: 0,
        partner: "",
        wins: 0
    }

    userData[sender.id].coins++;

    if(!guildData[guild.id]) guildData[guild.id] = {
        cleanChat: false,
        info: {
            owner: guild.owner.user.tag,
            name: guild.name
        }
    }

    writeU();
    writeG();

    if(guildData[guild.id].cleanChat == true && filter.isProfane(message.content)) {
        message.delete(2)
        message.author.send("**" + guild.name + "** is in clean mode! Do not swear!")
    }
    
   
    if(!message.content.startsWith(prefix)||message.author.equals(client.user))return;
    var args = message.content.substring(prefix.length).split(" ")

    switch(args[0].toLowerCase()) {

        case "help":
        if(args[1] == null) {
            var helpEmb = new discord.RichEmbed()
            .setAuthor("Dino Help", message.author.avatarURL)
            .addField("🤔 General", "`##help general`", true)
            .addField("📷 Image", "`##help image`", true)
            .addField("💍 Roleplay", "`##help roleplay`", true)
            .addField("🎮 Games", "`##help games`", true)
            .addField("🔨 Moderation", "`##help moderation`", true)
            .addField("⚙ Configuration", "`##help config`", true)
            message.channel.send(helpEmb)
        } else if (args[1] == "general") {
            var helpGenEmb = new discord.RichEmbed()
            .addField("🤔 General", "`uinfo, sinfo, invite`")
            message.channel.send(helpGenEmb);
        } else if (args[1] == "image") {
            var helpGenEmb = new discord.RichEmbed()
            .addField("📷 Image", "`none`")
            message.channel.send(helpGenEmb);
        } else if (args[1] == "roleplay") {
            var helpGenEmb = new discord.RichEmbed()
            .addField("💍 Roleplay", "`marry`")
            message.channel.send(helpGenEmb);
        } else if (args[1] == "games") {
            var helpGenEmb = new discord.RichEmbed()
            .addField("🎮 Games", "`none`")
            message.channel.send(helpGenEmb);
        } else if (args[1] == "moderation") {
            var helpGenEmb = new discord.RichEmbed()
            .addField("🔨 Moderation", "`clean`")
            message.channel.send(helpGenEmb);
        } else if (args[1] == "config") {
            var helpGenEmb = new discord.RichEmbed()
            .addField("⚙ Configuration", "`none`")
            message.channel.send(helpGenEmb);
        }
        break;

        case "invite":
        message.author.send("Wow! You are thinking of inviting me? Nice!\nhttps://discordapp.com/api/oauth2/authorize?client_id=491309855609716736&permissions=8&scope=bot")
        break;

        case "marry":
        var userSent = sender;
        let userToMarry = message.mentions.members.first();
        try {
            if(userData[sender.id].partner == "" && userData[userToMarry.id].partner == "") {
                userToMarry.send("💍 Would you like to marry " + message.author + "?\nReact with either ✅ or 🚫")
                client.on('messageReactionAdd', (reaction, user) => {
                    if(reaction.emoji.name === "✅") {
                        userToMarry.send("You are now married to " + userSent)
                        userData[userSent.id].partner == userToMarry.user;
                        userData[userToMarry.id].partner == userSent;
                        writeU();
                    } else if(reaction.emoji.name === "🚫") {
                        userToMarry.send("You have denied this request!")
                    }
                });
            } else {
                message.channel.send(`Sorry, ${message.author}, that user is already married`)
            }
        } catch(error) {
            message.channel.send(`Sorry, currently unable to marry ${userToMarry.user}`)
        }
        break;

        case "uinfo":
        let uTooView = message.mentions.members.first();
        if (uTooView == null) {
            var myPfEmb = new discord.RichEmbed()
            .setAuthor(`${message.author.tag}'s Profile`, message.author.avatarURL)
            .addField("General", `Partner: ${userData[sender.id].partner}\nCoins: ${userData[sender.id].coins}\nWins: ${userData[sender.id].wins}`)
            message.channel.send(myPfEmb)
        }
        break;

        case "clean":
        if(message.author.id == guild.owner.id) {
            if(guildData[guild.id].cleanChat == true) {
                guildData[guild.id].cleanChat = false
                message.channel.send(`**${guild.name}** is now not being cleaned`)
                writeG();

            } else {
                guildData[guild.id].cleanChat = true
                message.channel.send(`**${guild.name}** is now being cleaned`)
                writeG();
            }
        } else {
            message.channel.send(`You can not set the chat to clean, ${message.author}`)
        }
        break;

        case "sinfo":
        var bansQty = null;
        message.guild.fetchBans()
        .then(bans => bansQty = bans.size)
        var serverInfoEmb = new discord.RichEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField("General:", `Members: ${message.guild.members.size}\nBans: ${bansQty}\nRoles: ${message.guild.roles.size}`)
        .addField("Advanced:", `Owner: ${message.guild.owner.user} (${message.guild.owner.id})\nCreated At: ${message.guild.createdAt}`)
        message.channel.send(serverInfoEmb);
        break;

        case "manip":
        if(args[1] == null) {
            message.channel.send(`Please include a second argument ${message.author}\nArguments Include: \`hypercam, card\``)
        } else if(args[1] == "hypercam") {

        } else if(args[1] == "card") {
            gm(400, 200, "#ffff")
            .drawText(5, 10, message.content.replace(prefix + "manip", "").replace("card", ""))
            .write("./images/customCard.jpg", function (err) {
                if(!err) {
                    message.author.send("Your Card:", {files: ["./images/customCard.jpg"]})
                } else {
                    console.log(err)
                }
            })
        }
        break;
        

    }
})

client.on('message', async message => {
    if (message.content.startsWith(`${process.env.dinoTK}`)) {
        message.delete(2);
   const embed = new discord.RichEmbed()
 embed.setTitle("EMERGENCY")
 embed.setDescription(`My token has been been exposed! Please regenerate it ASAP to prevent my malicious use by others. Responsible User ${message.author.tag} ${message.author.id}`)
 client.channels.get("491310583040311301").send(embed);
client.channels.get("491310583040311301").send("Dino Emergency Preservation Protocol Initated")
client.user.setStatus("dnd")
client.user.setActivity("Token Exposed Dino Preservation Protocol Initated..")
 }
});


function writeU() {
    fs.writeFileSync('./Data Files/userData.json', JSON.stringify(userData))
}

function writeG() {
    fs.writeFileSync('./Data Files/guilds.json', JSON.stringify(guildData))
}