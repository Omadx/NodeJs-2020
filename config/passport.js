const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const localStrategy = require('passport-local').Strategy;

// Referencia modelo a auth
const Usuario = require('../models/Usuarios');

// local strategy
passport.use(
  new localStrategy(
    // por default passport espera  un usuario y password
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: { email, activo: 1 },
        });
        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: 'Password Incorrecto',
          });
        }
        // El email existe, y el password correcto
        return done(null, usuario);
      } catch (error) {
        return done(null, false, {
          message: 'Esa cuenta no existe',
        });
      }
    }
  )
);

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

// Desearializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

// exportar
module.exports = passport;
