module.exports = {
	name: 'template',
    description: 'Template command - args: true - guildOnly: true.',
	usage: '<user> <role>',
	cooldown: 10,
	args: true,
	guildOnly: true,	
	execute(message, args) {		
        if (args[0] === 'foo') {
			return message.channel.send('bar');
		}
		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};