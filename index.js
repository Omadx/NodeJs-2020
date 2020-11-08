//import express from 'express';
const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({ path: 'variables.env' });

// helpers para algunas funciones
const helpers = require('./helpers');

// Crear conexion a la bd
const db = require('./config/db');

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
  .then(() => console.log('Conectado al servidor'))
  .catch((error) => console.log(error));

// Crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar PUG
app.set('view engine', 'pug');

// habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Añadir las vistas
app.set('views', path.join(__dirname, './views'));

app.use(cookieParser());

// Nos permite auth en varias sin volver auth
app.use(
  session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Añadir flash messages
app.use(flash());

// Pasar var dump
app.use((req, res, next) => {
  //console.log(req.user);
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = { ...req.user } || null;
  console.log(res.locals.usuario);
  next();
});

app.use((req, res, next) => {
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});

require('./handlers/email');

// Aprendiendo
app.use('/', routes());

// servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
// Puerto
//app.listen(3000);
app.listen(port, host, () => {
  console.log('El servidor esta funcionando');
});
