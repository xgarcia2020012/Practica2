const express = require('express');
const cursosController = require('../controllers/cursos.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();


api.post('/agregarCursos',md_autenticacion.Auth,cursosController.agregarCursos);
api.put('/editarCursos/:dCursos',md_autenticacion.Auth,cursosController.editarCursos);
api.delete('/eliminarCursos/:idCursos', md_autenticacion.Auth,cursosController.eliminarCursos);
module.exports =api;

