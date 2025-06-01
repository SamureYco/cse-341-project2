const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

const port = process.env.PORT || 3000;
const app = express();

// Configuración CORS unificada
app.use(cors({
  origin: "*",  // Puedes restringir esto si necesitas seguridad más estricta
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Z-Key"]
}));

// Middlewares
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/", require("./routes/index.js"));
app.use("/api-docs", require("./routes/swagger"));

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

// Ruta para iniciar sesión con GitHub
app.get('/login/github', passport.authenticate('github'));

// Callback después del login en GitHub
app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
  }),
  (req, res) => {
    // 👇 ESTA LÍNEA ES CLAVE
    req.session.user = {
      id: req.user.id,
      username: req.user.username
    };
    console.log("Usuario guardado en sesión:", req.session.user);
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
