//Require
const express = require("express")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//Iniciar variables
let app = express();
let colorVerde = '\x1b[32m%s\x1b[0m'

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    next();
  });

//bodyParser
app.use(bodyParser.urlencoded({extend : false}));
app.use(bodyParser.json());


let appRoutes = require('./routes/app')
let applogin = require('./routes/login')
let appUsuario = require('./routes/usuario')
let appHospital = require('./routes/hospital')
let appMedico = require('./routes/medico')
let appBusqueda = require('./routes/busqueda')
let appUpload = require('./routes/upload')
let appImagenes = require('./routes/imagenes')

//Conexion a la base de datos
mongoose.connection.openUri(`mongodb://localhost:27017/hospitaldb`, (err)=>{
    if (err) throw err

    console.log('Base de datos \x1b[32m%s\x1b[0m' ,'online')

} )

// Server index config
// let serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


//rutas
app.use('/usuario',appUsuario)
app.use('/login',applogin)
app.use('/hospital',appHospital)
app.use('/medico',appMedico)
app.use('/busqueda',appBusqueda)
app.use('/upload',appUpload)
app.use('/img',appImagenes)
//app.use('/medico',appMedico)
app.use('/',appRoutes)


//Escuchar peticiones
app.listen(3000,() => {
 console.log('Express Server puerto 3000 \x1b[32m%s\x1b[0m' ,'online')
})