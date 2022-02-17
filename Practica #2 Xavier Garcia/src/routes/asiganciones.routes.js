// IMPORTACIONES
const express = require('express');
const asignacionesController = require('../controllers/asignacion.controller');
const md_autenticacion =  require('../middlewares/autenticacion');
const api = require('./usuario.routes');

api.post('/agregarAsignaciones', md_autenticacion.Auth, asignacionesController.AsignacionCurso);
api.get('/obtenerAsignaciones', md_autenticacion.Auth, asignacionesController.AsignacionAlumno);


module.exports = api;