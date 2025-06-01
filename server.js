require('dotenv').config();

console.log("ClientID:", process.env.GITHUB_CLIENT_ID);
console.log("ClientSecret:", process.env.GITHUB_CLIENT_SECRET);
console.log("CallbackURL:", process.env.CALLBACK_URL);

const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

const port = process.env.PORT || 3000;
const app = express();

// Middlewares
app
  .use(bodyParser.json())
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, PATCH, OPTIONS, DELETE"
    );
    next();
  })
  .use(cors({ methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"] }))
  .use(cors({ origin: "*" }))
  .use("/", require("./routes/index.js"))
  .use("/api-docs", require("./routes/swagger"));

// Passport GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Rutas

// Ruta para iniciar sesión con GitHub
app.get('/login/github', passport.authenticate('github'));

// Callback después del login en GitHub
app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/", (req, res) => {
  const message = req.user
    ? "Logged in as " + req.user.displayName
    : "Logged Out";
  res.send(message);
});

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Inicializar base de datos y levantar servidor
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log("Database is listening and Node is running on port " + port);
    });
  }
});
