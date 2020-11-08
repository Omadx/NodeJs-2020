const { sync } = require('../config/db');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {
  //console.log(res.locals.usuario);

  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  res.render('index', {
    nombrePaginas: 'Proyectos ' + res.locals.year,
    proyectos,
  });
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  res.render('nuevoProyecto', {
    nombrePaginas: 'Nuevo Proyecto',
    proyectos,
  });
};

exports.nuevoProyecto = async (req, res) => {
  // Enviar a la consola lo que usuario introduce
  // console.log(req.body);

  // Validar que tenemos algo en el input
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });
  const nombre = req.body.nombre;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: 'Agrega un nombre al proyecto' });
  }

  // si hay errores
  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePaginas: 'Nuevo Proyecto',
      errores,
      proyectos,
    });
  } else {
    // no hay errores / insertamos
    const usuarioId = res.locals.usuario.id;
    await Proyectos.create({ nombre, usuarioId });
    res.redirect('/');
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = await Proyectos.findAll({ where: { usuarioId } });
  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId,
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  // Consultar Tareas del Proyecto Actual
  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id,
    },
    include: [{ model: Proyectos }],
  });

  if (!proyecto) return next();
  //console.log(proyecto);
  res.render('tareas', {
    nombrePaginas: 'Tareas del Proyecto',
    proyecto,
    proyectos,
    tareas,
  });
};

exports.formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = await Proyectos.findAll({ where: { usuarioId } });
  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId,
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  res.render('nuevoProyecto', {
    nombrePaginas: 'Editar Proyecto',
    proyectos,
    proyecto,
  });
};

exports.actualizarProyecto = async (req, res) => {
  // Enviar a la consola lo que usuario introduce
  // console.log(req.body);

  // Validar que tenemos algo en el input
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });
  const nombre = req.body.nombre;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: 'Agrega un nombre al proyecto' });
  }

  // si hay errores
  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePaginas: 'Nuevo Proyecto',
      errores,
      proyectos,
    });
  } else {
    // no hay errores / insertamos
    await Proyectos.update(
      { nombre: nombre },
      { where: { id: req.params.id } }
    );
    res.redirect('/');
  }
};

exports.eliminarProyecto = async (req, res, next) => {
  // req, query o params
  const { urlProyecto } = req.query;

  const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

  if (!resultado) {
    return next();
  }
  res.status(200).send('Proyecto ELiminado correctamente');
  //console.log(req.params);
};
