// IMPORTACIONES
const express = require('express');
const cors = require('cors');


var app = express();
//importacion del pdf
const PdfPrinter = require("pdfmake");
const fs = require("fs");


//Importaciones de rutas pdf
const fonts = require("./src/pdfStyles/fonts");
const Styles = require("./src/pdfStyles/styles");
const {content} = require("./src/pdfStyles/pdfContent");

let docDefinition ={
    content: content,
    Styles: Styles 
};

const printer = new PdfPrinter(fonts);

let pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream("./src/pdfs/pdfTest.pdf"));
pdfDoc.end();


// IMPORTACIONES RUTAS
const AsigancionesRutas = require('./src/routes/asiganciones.routes');
const UsuarioRutas = require('./src/routes/usuario.routes');
const CursosRutas = require('./src/routes/cursos.routes');
const styles = require('./src/pdfStyles/styles');


// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', AsigancionesRutas, UsuarioRutas, CursosRutas);


module.exports = app;
