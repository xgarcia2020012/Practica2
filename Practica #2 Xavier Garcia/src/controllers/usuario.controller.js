const express = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');




function agregarMaestro(req, res) {
    var parametros = req.body;
    var usuarioModelo = new Usuario();

    if (parametros.email) {
        usuarioModelo.nombres = 'MAESTRO';
        usuarioModelo.email = parametros.email;
        usuarioModelo.rol = 'Maestro_rol';
    }
    Usuario.find({ email: parametros.email }, (err, usuarioGuardado) => {
        if (usuarioGuardado.length == 0) {
            bcrypt.hash("123456", null, null, (err, passswordEncypt) => {
                usuarioModelo.password = passswordEncypt
                usuarioModelo.save((err, usuarioGuardado) => {
                    console.log(err)
                    if (err) return res.status(500).send({ message: "error en la peticion" });
                    if (!usuarioGuardado) return res.status(404).send({ message: "Lo sentimos no se agrego " });
                    return res.status(201).send({ usuario: usuarioGuardado });
                })
            })

        } else {
            return res.status(500).
                send({ message: "esta usando el mismo email" });
        }
    })
}



function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email : parametros.email }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
                    if ( verificacionPassword ) {
                        // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }

                        
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'No son la password'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    })
}

function agregarAlumno(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

    if (parametros.nombre && parametros.email && parametros.password) {
        usuarioModel.nombre = parametros.nombre;
        usuarioModel.email = parametros.email;
        usuarioModel.rol = 'Alumno_Rol';

        Usuario.find({ email: parametros.email }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length == 0) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                        if (!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al agregar usuario' });
                        return res.status(200).send({ usuario: usuarioGuardado });
                    });

                });


            } else {
                return res.status(500).send({ mensaje: 'Este email ya esta en uso ' })
            }
        })
    }
}

function EditarUsuario(req, res) {
    var idUser = req.params.idUsuario;
    var parametros = req.body;    

    if ( idUser !== req.user.sub ) return res.status(500)
        .send({ mensaje: 'No puede editar otros usuarios'});

    Usuario.findByIdAndUpdate(req.user.sub, parametros, {new : true},
        (err, usuarioActualizado)=>{
            if(err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
            if(!usuarioActualizado) return res.status(500)
                .send({ mensaje: 'Error al editar el Usuario'});
            
            return res.status(200).send({usuario : usuarioActualizado})
        })
}


function EliminarUsuario(req, res) {
    var idUser = req.params.idUsuario;

    Usuario.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!usuarioEliminado) return res.status(404).send( { mensaje: 'Error al eliminar el usuario'});

        return res.status(200).send({ usuario: usuarioEliminado});
    })
}

module.exports = {
 
    Login,
    EditarUsuario,
    agregarMaestro,
    agregarAlumno,
    EliminarUsuario
}