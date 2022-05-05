const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config();
const {prefix} = require('./config.json');
// const GuildCommands  = require('./models/GuildCommands'); 

const client = new Discord.Client(); // client Object

client.commands = new Discord.Collection(); // Commmands collection Object

const commandFiles = fs.readdirSync('./discordbot/commands').filter(file => file.endsWith('.js')); //Read commands files Obj then loop and set client.commands Object
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection(); // cooldown Collection Object

client.on('ready', () => { // On ready/connect event
  console.log(`* Discord bot logged in as ${client.user.tag}!`);
});

client.on('message', (message) => { // On message event
  if (!message.content.startsWith(prefix) || message.author.bot) return; // Ignore messages from the bot and no prefix
  
  const args = message.content.slice(prefix.length).split(/ +/); // Arguments - prefix
  const commandName = args.shift().toLowerCase(); // command name shift first argument and toLowerCase()
  
  if (!client.commands.has(commandName)) return; // if client.commands.has(commandName) false return
  const command = client.commands.get(commandName); // command name from command Object from client.commands
  
  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!')
  }
  
  if (command.args && !args.length) {
    // return message.channel.send(`You didn't provide any arguments, ${message.author}!`)
    let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
  
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  
  try {
    command.execute(message, args);    
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }  
});

// Bot Managed guilds Array
const guildCheck = () => {  
  return client.guilds.cache.map(g => g.id);
}

// Get channel id by guild id and channel name.
const getChannelID = (guildID, channelName) => {
  const guild = client.guilds.resolve( guildID );
  if (guild) {
    const channelIDResults = guild.channels.cache.map( channel => {
      if (channel.name === channelName) {        
        return channel.id;  
      }
    });
    // channel.type === "text"
    if (channelIDResults) {
      const resID = channelIDResults.filter((i) => i !== undefined);
      return resID;
    } // else console.log("There's no channel with that ID.");
  } else console.log("There's no guild with that ID.");
}

// Get role id by guild id and role name.
const getRoleID = (guildID, roleName) => {
  const guild = client.guilds.resolve( guildID );
  if (guild) {
    const roleIDResults = guild.roles.cache.map( (role) => {
      if (role.name === roleName) {
        return role.id;
      }
    });
    // channel.type === "text"
    if (roleIDResults) {
      const resID = roleIDResults.filter((i) => i !== undefined);
      return resID;
    } 
    // else console.log("There's no channel with that ID.");
  } else console.log("There's no guild with that ID.");
}

const GuildMonitorEvent = (id, channelID, roleID, msg) => {  
  // Event Type Down Up 
  const guild = client.guilds.resolve(id);
  // console.log(guild);
  if (guild) {
    // console.log( guild.channels );
    const channel = guild.channels.resolve(channelID);
    if (channel) {
      roleID === undefined || roleID === "" ?
        channel.send(`${msg}`)
          : roleID === "@everyone" ?
        channel.send(`${roleID} ${msg}`)
          : channel.send(`<@&${roleID}> ${msg}`)      
    } else {
      console.log("There's no channel with that ID.");
    }
  } else console.log("There's no guild with that ID.");
}

// module.exports.GuildMonitorEvent = GuildMonitorEvent = ( id, channelID ) => {  
//   const guild = client.guilds.resolve( id ); //.get( "414263279599353856" )
//   // console.log(guild);
//   if (guild) {
//     // console.log( guild.channels );
//     const channel = guild.channels.resolve( channelID ) //get( "712825181835493486" );
//     if (channel) channel.send("Here you can put the message and stuffs.");
//     else console.log("There's no channel with that ID.");
//   } else console.log("There's no guild with that ID.");
// }
// const downEventHandling = ( id, channelID, alert ) => {  
//   const guild = client.guilds.resolve( id ); 
//   // console.log(guild);
//   if (guild) {
//     // console.log( guild.channels );
//     const channel = guild.channels.resolve( channelID );
//     if (channel) channel.send("Here you can put the message and stuffs.");
//     else console.log("There's no channel with that ID.");
//   } else console.log("There's no guild with that ID.");
// }

// Send message in a spasific channel 
// 414263279599353856/712825181835493486 Works 
// module.exports = testFunc2 = testFunc2 = () => {
//   const guild = client.guilds.resolve("414263279599353856"); //.get( "414263279599353856" )
//   // console.log(guild);
//   if (guild) {
//     // console.log( guild.channels );
//     const channel = guild.channels.resolve( "712825181835493486" ) //get( "712825181835493486" );
//     if (channel) channel.send("Here you can put the message and stuffs.");
//     else console.log("There's no channel with that ID.");
//   } else console.log("There's no guild with that ID.");
// }

client.login(process.env.DISCORD_PASS_OAUTH);

module.exports = {
  GuildMonitorEvent,
  getChannelID,
  getRoleID,
  guildCheck
}