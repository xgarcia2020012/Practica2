

// importaciones

const express = require('express');
const Asignacion = require('../models/asignacion.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');

function AsignacionCurso(req, res){
    var parametros = req.body;
    var asignacionModelo = new Asignacion();

    Asignacion.find({ idAlumno: req.user.sub}, (err, asignacionCurso)=>{
        if(asignacionCurso.length == 3){


            return res.status(500).send({mensaje: "No pueden asiganrse a mas de 3 lo siento"});
        }else{
            Asignacion.find({idCurso: parametros.idCurso, idAlumno: req.user.sub},(err, asignacionesCursos) => {
                if(asignacionesCursos.length == 0){
                    if(parametros.idCurso){
                        asignacionModelo.idAlumno = req.user.sub;
                        asignacionModelo.idCurso = parametros.idCurso;

                        asignacionModelo.save((err, asignacionGuardada) =>{
                            if(err) return res.status(500).send({mensaje:"Error en la peticion"});
                            if (!asignacionGuardada) return res.status(404).send({mensaje:"No es posible meterse a ningun curso "});

                            return res.status(200).send({asignacion: asignacionGuardada});
                        })
                    }
                }else{
                    return res.status(500).send({mensaje:"Este curso ya esta asignado "});
                }
            }).populate('idAlumno','nombre')
        }
    })
}

function AsignacionAlumno(req, res) {
    Asignacion.find({idAlumno:req.user.sub}, (err, asignacionObtenida) => {
        if (err) return res.status(500).send({mensaje:"Error en la peticion"});
        if (!asignacionObtenida) return res.status(404).send({mensaje: "No se encuentran las asignaciones"});

        return res.status(200).send({asignaciones: asignacionObtenida});
    })
}

module.exports = {
    AsignacionCurso,
    AsignacionAlumno
}







