const express = require("express");
const bodyParser = require('body-parser')
let app = express();

let Hospital = require('../models/hospital');
let Medico = require('../models/medico')
let Usuario  =  require('../models/usuario')

//=========================================
//BUSQUEDA GENERAL
//=========================================
app.get('/todo/:busqueda', (req,res, next)=>{
    let busqueda = req.params.busqueda
    let regex =  new RegExp(busqueda,'i');

    Promise.all([
                busquedaHospitales(regex),
                busquedaMedicos(regex),
                busquedaUsuarios(regex)
            ])
            .then(respuestas=>{
                
                return res.status(200).json({
                    ok:true,            
                    Hospitales: respuestas[0],
                    Medicos: respuestas[1],
                    Usuarios: respuestas[2]
                })
            })
            .catch(err =>{
                return res.status(500).json({
                    ok:false,            
                    errors: err
                })
            })
 })


 //=========================================
//BUSQUEDA ESPECÍFICA
//=========================================
app.get('/todo/collecion/:tabla/:busqueda',(req,res)=>{
    
    let tabla = req.params.tabla    
    let busqueda = req.params.busqueda
    let regex =  new RegExp(busqueda,'i');    
    let promesa
    
    switch(tabla){
        case'usuarios':
            promesa = busquedaUsuarios(regex)
            break;
        case 'medicos':
            promesa = busquedaMedicos(regex)
            break;
        case 'hospitales':
            promesa = busquedaMedicos(regex)
                break;
        default: return res.status(400).json({
            ok: false,
            mensaje:'Los tipos de busqueda sólo son: usuarios, medicos, y  hospitales',
            erros : { message : 'Tipo de tabla/coleccion no válido'}
        })
    }

    promesa.then(resultado => {        
        return res.status(200).json({
            ok: true,
            [tabla]: resultado
        })        
    })
    
    
})


 let busquedaHospitales = async (regex)=>{     
    return  await Hospital.find({nombre: regex})
                          .populate('usuario')
                          .exec()
                          .then(resp => resp)
                          .catch(err => {throw new Error(err)})     
}

 let busquedaMedicos = async (regex)=>{     
     return  await Medico.find({nombre: regex})
                         .populate('usuario', 'nombre email')
                         .populate('hospital')
                         .exec()
                         .then(Medicos => Medicos)
                         .catch(err => {throw new Error(err) })    
 }
 let busquedaUsuarios = async (regex)=>{     
     return await Usuario.find({}, 'nombre email role' ) 
                            .or([{'nombre': regex}, {'email': regex}])
                            .exec( )
                            .then(Usuarios => Usuarios)
                            .catch(err => { throw new Error(err)})    
 }
 
 
 module.exports = app;
 