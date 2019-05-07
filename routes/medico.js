const express = require('express')
const { verificaToken } = require('../middlewares/autenticacion')
let app =  express();

let Medico = require('../models/medico')



app.get('/', (req, res, nex)=>{
    let desde = req.query.desde;
    desde = Number(desde);
    Medico.find()   
          .skip(desde)
          .limit(5)       
          .populate('usuario',['nombre','email'])
          .populate('hospital')          
          .exec((err, MedicoDB)=>{
              if(err){
                  return res.status(500).json({
                      ok: false,
                      mensaje:'Error al obtener los médicos',
                      errors: err
                  })
                }//fin if err   
                Medico.count({}, (err,conteo)=>{
                    return res.status(200).json({
                        ok:true,
                        total: conteo,
                        medico: MedicoDB
                    })
                })
              
          })

})



app.post('/',[verificaToken],(req,res)=>{
    let body = req.body
    

    let medico = new Medico({
        nombre:  body.nombre,
        usuario: req.usuario._id,
        hospital :body.hospital
    })


    medico.save((err,medicoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al guardar medico',
                errors: err
            })
        }//fin if err

        return res.status(201).json({
            ok:true,
            medigo:medicoDB
        })
    })
})


app.put('/:id',[verificaToken],(req,res)=>{

    let body = req.body;
      let id = req.params.id;

    Medico.findById(id,(err, MedicoBD)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar médico',
                errors: err
            });            
        }

        if(!MedicoBD){
            return res.status(400).json({
                ok: false,
                mensaje:`El médico con el id ${id} no existe`,
                errors: {message:'No existe un médico con el ID'}
            }); 
        }

        MedicoBD.nombre= body.nombre,
        MedicoBD.usuario= req.usuario._id,
        MedicoBD.hospital =body.hospital
        MedicoBD.save((err, MedicoGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje:'Error al actualizar el médico',
                    errors: err
                    
                })
            }

            return res.status(200).json({
                ok:true,
                mensaje:'El médico se actualizó',
                usuario: MedicoGuardado
            })
        })
    })

})


app.delete('/:id',[verificaToken],(req,res)=>{

    let id = req.params.id;    
    Medico.findByIdAndRemove(id,(err,MedicoBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'Error al eliminar Medico',
                errors: err
            })
        }

        if(!MedicoBorrado){
            return res.status(400).json({
                ok: false,
                mensaje:`No existe un Medico con el id ${id}` ,
                errors: { message:`No existe un Medico con el id ${id}`}
            })
        }


        return res.status(200).json({
            ok:true,
            mensaje :'El médico ha sido borrado',
            usuario: MedicoBorrado
        })
    })
})



module.exports = app