module.exports = {
	name: 'temp-no',
    description: 'Template command  without arguments - args: false - guildOnly: true - cooldown: 10 .',
    cooldown: 10,
    args: false,
    guildOnly: true,    
	execute(message, args) {        
		message.channel.send(`Response ${message.author}`);
	}
};