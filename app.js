//Require
const express = require("express")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//Iniciar variables
let app = express();
let colorVerde = '\x1b[32m%s\x1b[0m'

//bodyParser
app.use(bodyParser.urlencoded({extend : false}));
app.use(bodyParser.json());


let appRoutes = require('./routes/app')
let applogin = require('./routes/login')
let appUsuario = require('./routes/usuario')

//Conexion a la base de datos
mongoose.connection.openUri(`mongodb://localhost:27017/hospitaldb`, (err)=>{
    if (err) throw err

    console.log('Base de datos \x1b[32m%s\x1b[0m' ,'online')

} )

//rutas
app.use('/usuario',appUsuario)
app.use('/login',applogin)
app.use('/',appRoutes)


//Escuchar peticiones
app.listen(3000,() => {
 console.log('Express Server puerto 3000 \x1b[32m%s\x1b[0m' ,'online')
})