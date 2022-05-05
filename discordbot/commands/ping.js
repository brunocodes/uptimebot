module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 10,
    args: false,
    guildOnly: true, 
	execute(msg, args) {
		msg.channel.send('Pong.......');
	},
};