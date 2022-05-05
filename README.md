# UptimeBot
MERN Stack uptime monitoring web app and Discord Bot. Receive discord notifications in a specific channel when a website or service goes down.

### Alpha v0.0.7:
HTTP and HTTPS monitoring
* Monitoring HTTP that you expect a 200 Status result. 
* Set and monitor request latency.

##  Installation
```bash
git clone https://github.com/budthepit/bud_the_bot.git
cd bud_the_bot
npm install
```
## Replace the .env.example with your .env file and add discord client id, secret, session secret, Discord Bot Oauth and database link
```bash 
DISCORD_CLIENT_ID=
DISCORD_SECRET=
CALLBACK_URL=http://localhost:5050/auth/discord/callback
SESSION_SECRET=
DB_LINK=
DISCORD_PASS_OAUTH=
CLIENT_DASH_PAGE_URL=http://localhost:3000/dashboard
CLIENT_HOME_PAGE_URL=http://localhost:3000
HOME_PAGE=http://localhost:3000
PRODUCTION=false
PORT=5050
```

## Replace YOURCLIENTID with you Discord client ID in the /client/src/env.json file.
```
"bot_link": "https://discord.com/api/oauth2/authorize?client_id=YOURCLIENTID&permissions=149504&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5050%2Fauth%2Fdiscord%2Fcallback&scope=bot&guild_id="
```

## Start 
```bash 
npm run dev 
```