const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config();
//const config = require('./config.json');
const { prefix } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
// Read commands files Obj then loop and set client.commands Object
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
// On ready/connect event
client.on('ready', () => {
  console.log(`* Discord bot logged in as ${client.user.tag}!`);
});
// On message event
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return; // Ignore messages from the bot and no prefix  
  
  const args = message.content.slice(prefix.length).split(/ +/); // Arguments - prefix
  const commandName = args.shift().toLowerCase(); // command name shift first argument and toLowerCase()
  
  if (!client.commands.has(commandName)) return; // if client.commands.has(commandName) false return

  const command = client.commands.get(commandName); // command Object from client.commands
  
  if (command.guildOnly && message.channel.type !== 'text') message.reply('I can\'t execute that command inside DMs!');
  
  if (command.args && !args.length) message.channel.send(`You didn't provide any arguments, ${message.author}!`);
  
  try {
    command.execute(message, args);    
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }  
});

module.exports = guildCheck = guildCheck = () => {  
  // console.log( client.guilds.cache.map(g => g.id +" "+g.name).join("\n") );
  return client.guilds.cache.map(g => g.id);
}

client.login( process.env.DISCORD_PASS_OAUTH );