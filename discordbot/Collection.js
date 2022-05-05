class Collection extends Map {

}
module.exports = Collection;

const cooldowns = new Collection();

// If there's no cooldown set cooldown
if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Map());
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