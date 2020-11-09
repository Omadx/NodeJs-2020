const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
  //res.send('funciona');
  res.render('crearCuenta', {
    nombrePaginas: 'Crear pagina un Uptask',
  });
};

exports.formIniciarSesion = (req, res) => {
  //res.send('funciona');
  const { error } = res.locals.mensajes;
  res.render('iniciarSesion', {
    nombrePaginas: 'Iniciar sesion pagina un Uptask',
    error,
  });
};

exports.crearCuenta = async (req, res) => {
  // leer los datos
  const { email, password } = req.body;

  try {
    // crear el usuario
    await Usuarios.create({
      email,
      password,
    });

    // Crear url de confrimar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    // crear obj de usuario
    const usuario = {
      email,
    };

    // enviar email
    await enviarEmail.enviar({
      usuario,
      subject: 'Confirmar tu cuenta',
      confirmarUrl,
      archivo: 'confirmar-cuenta',
    });

    // redirigir email
    req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
    res.redirect('/iniciar-sesion');
  } catch (error) {
    req.flash(
      'error',
      error.errors.map((error) => error.message)
    );
    res.render('CrearCuenta', {
      mensajes: req.flash(),
      nombrePaginas: 'Crear pagina un Uptask',
      email,
      password,
    });
  }
};

exports.formRestablecerPassword = (req, res) => {
  res.render('reestablecer', {
    nombrePaginas: 'Reestablecer tu contraseña',
  });
};

exports.confirmarCuenta = async (req, res) => {
  //res.json(req.params.correo);
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo,
    },
  });

  if (!usuario) {
    req.flash('error', 'No valido');
    res.redirect('crear-cuenta');
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash('correcto', 'Cuenta activada correctamente');
  res.redirect('/iniciar-sesion');
};
