const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorios',
});

// Funcion para revisar si el suario esta logueado
exports.usuarioAutenticado = (req, res, next) => {
  // si el usuario esta auth
  if (req.isAuthenticated()) {
    return next();
  }
  // sino, redirigir al formulario
  return res.redirect('/iniciar-sesion');
};

//
exports.cerrarSesion = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion');
  });
};

// generar un token si el usuario e valido
exports.enviarToken = async (req, res) => {
  // Verificar que el usuario existe
  const { email } = req.body;
  const usuario = await Usuarios.findOne({ where: { email } });

  // Si no existe el usuario
  if (!usuario) {
    req.flash('error', 'No existe esa cuenta');
    res.redirect('/reestablecer');
  }

  // Usuario existe
  usuario.token = crypto.randomBytes(20).toString('hex');
  usuario.expiracion = Date.now() + 360000;

  // guardarlos en la bd
  await usuario.save();

  // url bd
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  // expiracion
  //console.log(resetUrl);

  // Enviar correo con el token
  await enviarEmail.enviar({
    usuario,
    subject: 'Password Reset',
    resetUrl,
    archivo: 'reestablecer-password',
  });

  // Terminar
  req.flash('correcto', 'Se envio un mensaje a tu correo');
  res.redirect('/iniciar-sesion');
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
    },
  });

  // sino encuentra el usuario
  if (!usuario) {
    req.flash('error', 'No valido');
    res.redirect('/reestablecer');
  }

  // Formulario para generar el formulario
  res.render('resetPassword', {
    nombrePaginas: 'Reestablecer Contraseña',
  });
};

// Cambiar pas

exports.resetPassword = async (req, res) => {
  // Verifica token valido y epxericion
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte]: Date.now(),
      },
    },
  });
  if (!usuario) {
    req.flash('error', 'No Valido');
    res.redirect('/reestablecer');
  }

  // hashear password
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  // Guardar nuevo pass
  await usuario.save();
  req.flash('Correcto', 'Tu password se ha modificado correctamente');
  res.redirect('/iniciar-sesion');
};
