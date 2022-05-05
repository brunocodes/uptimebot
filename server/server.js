const express    = require('express');
const passport   = require('passport');
const session    = require('express-session');
const mongoose   = require('mongoose');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();
require('./passportSetup');
const { logger, log4js } = require('../logging/logger');
// ######  Middleware   #######
// Connect to Database and Config
mongoose.connect(process.env.DB_LINK, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}) 
.then(() => console.log('* UpBot DB Connected...'))
.catch((err) => logger.error("Error connecting to database.",{err}));
  
// Initialize Express and middlewares
const app = express();
app.use(express.json());

// Connect Mongo
const sessionStore = new MongoStore({ 
  mongooseConnection: mongoose.connection, 
  collection: 'sessions', 
  autoRemove: 'native'  
});
//  Express Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14// Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
  }
})); // Sessions should stay above passport middleware

// Use Passport Middleware  
app.use(passport.initialize());
app.use(passport.session());

// set up cors to allow us to accept requests from our client
if (process.env.PRODUCTION === "false") {
  const cors       = require('cors');
  app.use(
    cors({
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    })
  );
  
  app.use(log4js.connectLogger(log4js.getLogger("http"), { level: "auto",
    format: (req, res, format) => format(`:remote-addr ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent" - ${JSON.stringify(req.user)} - ${JSON.stringify(req.body)}`)
  }));
}

// API Use Routes
app.use("/auth", require('../routes/api/discordUser'));
app.use("/discord", require('../routes/api/discordAPI'));
app.use("/app", require('../routes/api/appAPI'));

// serve static assets if in production
if (process.env.PRODUCTION === "true") {// // set static folder
  const path = require('path');
	app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', '../client/build', 'index.html'));
  });
}
const PORT = process.env.PORT;
app.listen(PORT, ()=> console.log(`* server started on port ${PORT}`));