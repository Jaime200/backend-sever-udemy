//Require
const express = require("express")
const mongoose = require('mongoose')

//Iniciar variables
let app = express();
let colorVerde = '\x1b[32m%s\x1b[0m'

//Conexion a la base de datos
mongoose.connection.openUri(`mongodb://localhost:27017/hospitaldb`, (err)=>{
    if (err) throw err

    console.log('Base de datos \x1b[32m%s\x1b[0m' ,'online')

} )

//rutas
app.get('/', (req,res, next)=>{
   res.status(200).json({
       ok: true,
       message:{
           message: 'Todo esta Ok'
       }
   })
})

//Escuchar peticiones
app.listen(3000,() => {
 console.log('Express Server puerto 3000 \x1b[32m%s\x1b[0m' ,'online')
})