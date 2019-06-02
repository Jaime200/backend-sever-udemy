const express = require('express')
const { verificaToken } = require('../middlewares/autenticacion')
let app = express();
let Hospital = require('../models/hospital');

app.get('/',(req,res,next)=>{
    let desde =  req.query.desde
    desde = Number(desde)

    Hospital.find({})
            .skip(desde)
            .limit(5)
            .populate('usuario', ['nombre','email'])
            .exec( (err, HospitalBD)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        mensaje:'Error al cargar los hospitales',
                        errors: err
                    })
                }//fin if err
                Hospital.count({},(err,conteo)=>{
                    return res.status(200).json({
                        ok:true,
                        total: conteo,
                        Hospitales: HospitalBD
                    })
                })
                
            })
})


app.get('/:id',(req,res,next)=>{
    let id = req.params.id
    
    Hospital.findById(id, (err,HospitalDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar hospital',
                errors: err
            });            
        }

        if(!HospitalDB){
            return res.status(400).json({
                ok: false,
                mensaje:`El hospital con el id ${id} no existe`,
                errors: {message:'No existe un hospital con el ID'}
            }); 
        }

        return res.status(200).json({
            ok:true,
            Hospital: HospitalDB
        });
    })
})

app.post('/',[verificaToken] ,(req,res)=>{
    let body = req.body;
    console.log(body)
    let hospital = new Hospital({
        nombre  : body.nombre,
        //img     : body.img ? req.img : '',
        usuario : req.usuario._id
    })
    
    hospital.save((err,hospitalDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al crear hospital',
                errors: err
            })
        }//fin if err

        return res.status(201).json({
            ok:true,
            hospital: hospitalDB
        })
    })

})

app.put('/:id',[verificaToken],(req,res)=>{
    let id = req.params.id;
    let body = req.body;

    Hospital.findById(id,(err,HospitalDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar hospital',
                errors: err
            });            
        }

        if(!HospitalDB){
            return res.status(400).json({
                ok: false,
                mensaje:`El hospital con el id ${id} no existe`,
                errors: {message:'No existe un hospital con el ID'}
            }); 
        }

        HospitalDB.nombre  = body.nombre //? body.nombre: UsuarioDB.nombre 
        //HospitalDB.img   = body.img ? body.img: HospitalDB.img //?  body.email : UsuarioDB.email 
        HospitalDB.save((err, hospitalGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje:'Error al actualizar el hospital',
                    errors: err
                    
                })
            }

            return res.status(200).json({
                ok:true,
                mensaje:'El hospital se actualizó',
                usuario: hospitalGuardado
            })
        })
    })
})


app.delete('/:id',[verificaToken],(req,res)=>{
    let id = req.params.id 
    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'Error al eliminar hospital',
                errors: err
            })
        }

        if(!hospitalBorrado){
            return res.status(400).json({
                ok: false,
                mensaje:`No existe un hospital con el id ${id}` ,
                errors: { message:`No existe un hospital con el id ${id}`}
            })
        }


        return res.status(200).json({
            ok:true,
            mensaje :'El hospital ha sido borrado',
            usuario: hospitalBorrado
        })
    })
})

module.exports = app