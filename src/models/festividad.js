import mongoose from "mongoose";

const festividadSchema = new mongoose.Schema({
    mes: { type: String, required: true },
    dia: { type: Number, required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String },
}, { timestamps: true })

export default mongoose.model('Festividad', festividadSchema);