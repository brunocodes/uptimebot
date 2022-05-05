const UpMonitor = require('./UpMonitor');
const GuildCommands  = require('../models/GuildCommands');

const mon = new UpMonitor({ DISCORD_MONNOTE_URL: "http://localhost:5050/discord/monnote" });

let activeMonitorEvents = [];
GuildCommands.find({}, (err, guildCommandsDB)=> {
if (err) {
  console.log(err)
}

for (const guild in guildCommandsDB) {
  if (guildCommandsDB.hasOwnProperty(guild)) {
    const currentGuild = guildCommandsDB[guild];
    // console.log(currentGuild.events)
    const eventsArry = currentGuild.events.map( event => {
      const container = { ...event._doc };
      container.guild_id = currentGuild.guild_id;
      return container;
    });
    activeMonitorEvents.push(...eventsArry);
    if (activeMonitorEvents) {
      console.log(activeMonitorEvents)
      mon.monitor(activeMonitorEvents);
      console.log("* activeMonitorEvents TRUE")
    }
  }
}
// console.log(activeMonitorEvents)
});

// if (activeMonitorEvents[0]) {
//   console.log(activeMonitorEvents)
//   mon.monitor(activeMonitorEvents);
//   console.log("* activeMonitorEvents TRUE")
// }