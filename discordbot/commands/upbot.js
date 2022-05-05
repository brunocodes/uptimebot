module.exports = {
	name: 'upbot',
    description: 'Template command - args: true - guildOnly: true.',
	usage: '<Monitor Name>',
	cooldown: 10,
	args: true,
	guildOnly: true,	
	execute(message, args) {

        // const guildID = message.guild.id;
        const monitorName = args[0];
        // equivalent to: SELECT * FROM tags WHERE name = 'monitorName' LIMIT 1;
        // const monitor = Tags.findOne({ where: { name: monitorName } });
        // if (monitor) {
        //     // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'monitorName';
        //     monitor.increment('usage_count');
        //     return message.channel.send(monitor.get('description'));
        // }
        // return message.reply(`Could not find monitor: ${monitorName}`);
        


        // if (args[0] === 'foo') {
        //     // return message.channel.send('bar');
		// }
		// message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};