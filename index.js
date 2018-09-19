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
var port = process.env.PORT || 5000;

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
            .addField("🤔 General", "`uinfo, sinfo, invite, binfo`")
            message.channel.send(helpGenEmb);
        } else if (args[1] == "image") {
            var helpGenEmb = new discord.RichEmbed()
            .addField("📷 Image", "`manip`")
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
            .addField("🔨 Moderation", "`clean, purge`")
            message.channel.send(helpGenEmb);
        } else if (args[1] == "config") {
            var helpGenEmb = new discord.RichEmbed()
            .addField("⚙ Configuration", "`none`")
            message.channel.send(helpGenEmb);
        }
        break;

        case "binfo":
        var botInfoEmb = new discord.RichEmbed()
        .setAuthor("Dino Info", client.user.avatarURL)
        .addField("General:", `Users: ${client.users.size}\nGuilds: ${client.guilds.size}`)
        .addField("Statistics:", `Ping: \`${math.floor(client.ping)}ms\`\nUptime: \`${millisToMinutesAndSeconds(client.uptime)}s\``)
        .setFooter("Made By Jack 🌹👑#7908 and Phoenix#8196")
        message.channel.send(botInfoEmb)
        break;

        case "invite":
        message.author.send("Wow! You are thinking of inviting me? Nice!\nhttps://discordapp.com/api/oauth2/authorize?client_id=491309855609716736&permissions=8&scope=bot")
        break;

        case "marry":
        var userSent = message.author;
        let userToMarry = message.mentions.members.first();
        if(userToMarry != client.user) {
            try {
                if(userData[sender.id].partner == "" && userData[userToMarry.id].partner == "") {
                    userToMarry.send("💍 Would you like to marry " + message.author + "?\nReact with either ✅ or 🚫")
                    client.on('messageReactionAdd', (reaction, user) => {
                        if(reaction.emoji.name === "✅") {
                            userToMarry.send("You are now married to " + userSent)
                            userSent.send(`${userSent}, you are now married to ${userToMarry}!`)
                            userData[userSent.id].partner = userToMarry.user;
                            userData[userToMarry.id].partner = userSent;
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
        } else {

        }
        break;

        case "divorce":
        

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
        if(message.author.id == guild.owner.id || "412268614696304642") {
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

        case "purge":
        if(args[1] != null) {
            if(message.author.id == guild.owner.id || "412268614696304642") {
                message.channel.bulkDelete(args[1])
            } else {
                message.channel.send(`Sorry, ${message.author}, you do not have permission to run this command!`)
            }
        } else {
            
        }
        break;

        case "addbw": 
        if(message.author.id == '412268614696304642') {
            var word = message.content.replace(prefix + "addbw", "").replace(" ", "");
            filter.addWords(word);
            message.channel.send(`**${word}** is now added to the cleaning list!`);
        } else {

        }
        break;

        case "removebw":
        if(message.author.id == '412268614696304642') {
            var word = message.content.replace(prefix + "removebw", "").replace(" ", "");
            filter.removeWords(word);
            message.channel.send(`**${word}** is now removed from the cleaning list!`);
        } else {

        }
        break;

        case "announce":
        if (message.author.id === "412268614696304642") {
            try {
              let toSay = message.content.replace(prefix + "announce", "").replace(" ", "")
              client.guilds.map((guild) => {
                let found = 0
                guild.channels.map((c) => {
                  if (found === 0 && guild.id != 264445053596991498) {
                    if (c.type === "text") {
                      if (c.permissionsFor(client.user).has("VIEW_CHANNEL") === true) {
                        if (c.permissionsFor(client.user).has("SEND_MESSAGES") === true) {
                                c.send(toSay);
                                found = 1;
                        }
                      }
                    }
                  }
                });
              });
            }
            catch (err) {
              console.log("Could not send message to a (few) guild(s)! - " + err);
            }
          } else {
            message.reply("You cant do that!")
          }
        break;

        case "reboot":
            if (message.author.id == "338332694725263361" || "412268614696304642") {
            message.channel.send("Rebooting Dino")
            client.destroy()
            client.login(process.env.dinoTK)
            }
        break;

        default:
        message.channel.send("Command not found! Use `##help`!")
        .then(msg => {
            msg.delete(1000)
        })
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
    fs.writeFileSync('./Data Files/userData.json', JSON.stringify(userData), (err) => {
        console.log(err)
    })
} 

function writeG() {
    fs.writeFileSync('./Data Files/guilds.json', JSON.stringify(guildData), (err) => {
        console.log(err)
    })
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

const http = require('http')
var server = http.createServer();
server.listen(process.env.PORT || 5000)

setInterval(function() {
    http.get("http://dinobotdisc.herokuapp.com");
    console.log("Pinged!")
}, 300000); // every 5 minutes (300000)

/*How to send to host:
git add . && git commit -m "Commit Title"
git push origin master
git push heroku master
*/