const reqEvent = (event) => require(`../DinoEvents/${event}`);
module.exports = client => {
    client.on('ready', () => reqEvent('ready')(client));
    client.on('reconnectingHandler', () => reqEvent('reconnectingHandler')(client));
    client.on('disconnectModule', () => reqEvent('disconnectModule')(client));
};