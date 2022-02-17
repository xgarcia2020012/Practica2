
// importaciones
const express = require('express');
const Cursos = require('../models/cursos.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');

function obtenerCursos(req,res){
    Cursos.find((err, cursosObtenidos) =>{
        if(err) return res.send({mensaje:"Error: "+err})

        for(let i = 0; i<cursosObtenidos.length; i++){
            console.log(cursosObtenidos[i].nombre)
        }

        return res.send({cursos: cursosObtenidos})
    })
}


function agregarCursos(req, res){
    var parametros = req.body;
    var cursoModelo = new Cursos();

    if(parametros.nombre){
        cursoModelo.nombre = parametros.nombre;
        cursoModelo.idMaestro = req.user.sub;
    }else{
        return res.status(500).send({message:"error"})
    }

    if (req.user.rol == "Maestro_rol"){
        Cursos.find({nombre:parametros.nombre, idMaestro:req.user.sub},(err,cursosGuardados)=>{
            if (cursosGuardados.length == 0){
                cursoModelo.save((err, cursoGuardado)=>{
                    console.log(err)
                    if (err) return res.status(500).send({message:"error en la peticion"});
                    if(!cursoGuardado) return res.status(404).send({message:"Lo sentimos no se puede "});
                    return res.status(200).send({curso: cursoGuardado});
        
                })
            }else{
                return res.status(500).send({message:"Este curso  existe"});
            }
        }).populate('idMaestro', 'nombre')

    }else{
        return res.status(500).send({message:"no es maestro"});
    }
        

}


function editarCursos(req, res) {
    var idCursos = req.params.idCursos;
    var parametros = req.body;

    if(req.user.rol == "Maestro_rol") {
        Cursos.findByIdAndUpdate({id: idCursos,idMaestro: req.user.sub},parametros,{new:true},(err,cursosEditados)=>{


     if(err) return res.status(500).send({mensaje:"error a la accion"});
     if(!cursosEditados) return res.status(404).send({message:"Lo siento no se puede"});
                    return res.status(200).send({curso: cursosEditados});

        })
    
    
}else{

    return res.status(500).send({mensaje:"No tiene Autorizacion"});
}}





function eliminarCursos(req, res) {
    var idCursos = req.params.idCursos;

Cursos.findByIdAndDelete(idCursos, (err,cursoEliminado) => {
if (err) return res.status(500).send({message:"error en la peticion"});
if(!cursoEliminado) return res.status(404).send({message:"no se logro eliminar "});
return res.status(200).send({curso: cursoEliminado});
})
}

module.exports = {
    obtenerCursos,
    agregarCursos,
    editarCursos,
    eliminarCursos

}