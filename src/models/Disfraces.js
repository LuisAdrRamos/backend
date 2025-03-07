import mongoose, { Schema, model } from 'mongoose';

const disfrazSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    talla: {
        type: String,
        required: true,
        trim: true
    },
    calidad: {
        type: String,
        required: true,
        enum: ['Baja', 'Media', 'Alta']
    },
    categoria: {
        type: String,
        enum: ['Infantil', 'Adulto', 'Temático'],
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        required: false,
        default: null
    },
    favoritos: { 
        type: Number, default: 0 
    },
    compras: { 
        type: Number, default: 0 
    },
    festividad: { type: mongoose.Schema.Types.ObjectId, ref: "Festividad", default: null}

}, {
    timestamps: true
});

export default model('Disfraces', disfrazSchema);