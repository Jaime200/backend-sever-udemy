const express = require("express");
const fileUpload = require('express-fileupload');
const fs =  require('fs');

const bodyParser = require('body-parser')

let app = express();

let Usuario  =  require('../models/usuario')
let Hospital  =  require('../models/hospital')
let Medico  =  require('../models/medico')
app.use(fileUpload());
//rutas
app.put('/:tipo/:id', (req,res, next)=>{
    let tipo = req.params.tipo;
    let id = req.params.id;

    //tipos de colleccion
    let tiposValidos = ['hospitales', 'medicos','usuarios']
    if(tiposValidos.indexOf(tipo)< 0){
        return res.status(400).json({
            ok: false,
            mensaje:'Tipo de colección no válida',
            errors: {message: 'Tipo de colección no válida'}
        })
    }

    if(!req.files){
        return res.status(500).json({
            ok: false,
            mensaje:'No seleccionó imagen',
            errors: {message: 'Debe de seleccionar la imagen'}
        })
    }

    //obtener nombre del archivo
    let archivo = req.files.imagen;
    
    let nombreSplit = archivo.name.split('.')
    let extension = nombreSplit[nombreSplit.length - 1]

    //Extensiones válidas
    let extensionesValidas = ['png','jpg','gif','jpeg','PNG'];

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            mensaje:'Extensión no válida',
            errors: {message: 'Las extensiones válidas son' + extensionesValidas.join(', ')}
        })
    }
    //Nombre de archivo personalizado
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`

    //Mover el archivo a un path
    let path = `./uploads/${tipo}/${nombreArchivo}`

    archivo.mv(path,(err)=>{
        if(err){
           return  res.status(500).json({
               ok:false,
                mensaje:'Error al mover archivo',
                errors: err
           })
        }

        //funcion que verifica la logica de guardar la imagen
        subirPorTipo( tipo, id, nombreArchivo, res)

    })
    
 })


 function subirPorTipo( tipo, id, nombreArchivo, res){
     let promesa 
    switch(tipo){
        case 'usuarios': 
                     promesa = buscarUsuario(id)
                        break;
        case 'medicos': promesa = buscarMedico(id)
                        break;
        case 'hospitales': promesa = buscarHospital(id)
                         break;
        default: return res.status(400).json({
            ok: false,
            mensaje:'Error al subir la imagen',
            erros : { message : 'Error al subir la imagen'}
        })
    }//fin de switch

    promesa.then(resultado =>{
        if(!resultado){
            return res.status(400).json({
                ok: false,
                mensaje:`No se encuentra ${tipo} con el id ${id}`,
                errors : { message : `No se encuentra ${tipo} con el id ${id}`}
            })
        }//fin de if de resultado

       
        let pathViejo = `./uploads/${tipo}/${resultado.img}`
        //si existe elimina la imagen vieja
        
        if(fs.existsSync(pathViejo)){ fs.unlinkSync(pathViejo)}

        resultado.img = nombreArchivo        
        resultado.save( (err, registroActualizado)=>{
            
            if(err){
            throw new Error(err)
            }
                return  res.status(200).json({
                                    ok: true,
                                    message:{
                                        message: `imagen de ${tipo} actualizado`,                            
                                    },
                                    [tipo] :  registroActualizado
                })
        })

    })
    .catch(err=>{
        let pathGuardar = `./uploads/${tipo}/${nombreArchivo}`
        
        if(fs.existsSync(pathGuardar)){ fs.unlinkSync(pathGuardar)}

        return  res.status(500).json({
            ok: true,
            message:{
                message: `imagen de ${tipo} no fue actualizado`,
                errors :  err
    
            }
        })
    })
 }



 let buscarUsuario = async (id) =>{
    return await Usuario.findById(id)
            .exec()
            .then(usuario => usuario)
            .catch(err =>{throw new Error(err)})
 }


  let buscarHospital = async (id) =>{
    return await Hospital.findById(id)
            .exec()
            .then(hospital => hospital)
            .catch(err =>{throw new Error(err)})
 }


 let buscarMedico = async (id) =>{
    return await Medico.findById(id)
            .exec()
            .then(medico => medico)
            .catch(err =>{throw new Error(err)})
 }

 module.exports = app;
 