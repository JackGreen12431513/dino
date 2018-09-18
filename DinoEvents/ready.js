const repeat = require('repeat');
var activ = 0; //Crappy repeat mechanism, oh well ¯\_(ツ)_/¯
const prefix = "##";

module.exports = client => {

    console.log("Dino is alive and online!")
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
        activ -= 2;
        client.user.setActivity(`on ${client.guilds.size} guilds!`)
    }
}
}
