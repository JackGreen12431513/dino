const repeat = require('repeat');
var activ = 0; //Crappy repeat mechanism, oh well ¯\_(ツ)_/¯
const prefix = "##";
var loadUps = 0;

module.exports = client => {

    if(loadUps == 0) {
        loadUps += 1;
        console.log("Dino is alive and online!")
    } else {
        console.log("Bot Restarted!")
    }
    client.user.setActivity(`with ${client.users.size} users!`)
    repeat(changeSts).every(5000).start.in(1, 'sec');
    function changeSts() {
    if(activ == 0) {
        activ += 1;
        client.user.setActivity(`with ${client.users.size} users!`)
    } else if(activ == 1) {
        activ += 1;
        client.user.setActivity(`${prefix}help for help!`)
    } else if (activ == 2) {
        activ += 1;
        client.user.setActivity(`on ${client.guilds.size} guilds!`)
    } else if (activ == 3) {
        activ += 1;
        client.user.setActivity(`on https://discord.gg/H6QVmV2`)
    } else {
        activ -= 4;
        client.user.setActivity(`STILL IN WIP`)
    }
}
}
