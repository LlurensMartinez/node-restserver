const mongoose = require('mongoose')
const Schema = mongoose.Schema;


let comentariosSchema = new Schema({
    title: { 
        type: String, 
        unique: false, 
        required: [true, 'El titulo es obligatorio'] },
    comment: { 
        type: String, 
        unique: false, 
        required: [true, 'El comentario es obligatorio'] },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario' }
});


module.exports = mongoose.model('Comentarios', comentariosSchema);