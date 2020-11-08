const express = require('express');
const router = express.Router();

// importar express validator
const { body } = require('express-validator');

const proyectosController = require('../controllers/proyectoController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

// TODO: RUTAS
module.exports = function () {
  // ruta para el home / use --> lee get y post
  // send, json y render
  router.get(
    '/',
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  );

  router.get(
    '/nuevo-proyecto',
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto
  );

  router.post(
    '/nuevo-proyecto',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto
  );

  // Lista Proyectos
  router.get(
    '/proyectos/:url',
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl
  );

  // Actualizar el proyecto
  router.get(
    '/proyecto/editar/:id',
    authController.usuarioAutenticado,
    proyectosController.formularioEditar
  );

  router.post(
    '/nuevo-proyecto/:id',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.actualizarProyecto
  );

  // Eliminar proyecto
  router.delete(
    '/proyectos/:url',
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto
  );

  // Tareas
  router.post(
    '/proyectos/:url',
    authController.usuarioAutenticado,
    tareasController.agregarTarea
  );
  // Actualizar tarea
  router.patch(
    '/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea
  );
  // Elimianr la tarea
  router.delete(
    '/tareas/:id',
    authController.usuarioAutenticado,
    tareasController.eliminarTarea
  );

  // Crear una nueva cuenta
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.crearCuenta);
  router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

  // Inicar Sesion
  router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
  router.post('/iniciar-sesion', authController.autenticarUsuario);

  // Cerrar Sesion
  router.get('/cerrar-sesion', authController.cerrarSesion);

  // Reestablecer password
  router.get('/reestablecer', usuariosController.formRestablecerPassword);
  router.post('/reestablecer', authController.enviarToken);
  router.get('/reestablecer/:token', authController.validarToken);
  router.post('/reestablecer/:token', authController.resetPassword);

  return router;
};

// FIXME Hay que corregir el archivo
