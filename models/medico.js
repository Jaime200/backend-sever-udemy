let mongoose = require('mongoose');

let Schema = mongoose.Schema;


let medicoSchema = new Schema({
    nombre: {type: String, require : [true, 'El nombre es necesario' ]},
    img : { type: String, required: false},
    usuario: { type: Schema.Types.ObjectId, ref:'Usuario', require: true},
    hospital: { type: Schema.Types.ObjectId, ref : 'Hospital', required: [true, 'El id del Hospital es necesario']}
})


module.exports = mongoose.model('Medico', medicoSchema);