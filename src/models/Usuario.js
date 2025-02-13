import mongoose, { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

// Definición del esquema para el Usuario
const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    celular: {
        type: String,
        required: false,
        trim: true
    },
    direccion: {  // 🔹 Nuevo campo de dirección
        type: String,
        required: false,
        trim: true
    },
    fechaRegistro: {
        type: Date,
        required: true,
        trim:true,
        default: Date.now()
    },
    estado: {
        type: Boolean,
        default: true
    },
    token: {
        type: String,
        unique: true, // 🔹 Garantiza que cada usuario tenga un token único
        default: null
    },    
    // Este campo puede ser relacionado a periféricos si el usuario está asociado con algún grupo de periféricos
    disfracesFavoritos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Disfraces'
    }],
    // Este campo puede ser útil si el usuario tiene roles específicos
}, {
    timestamps: true
});

// Método para cifrar el password del Usuario
usuarioSchema.methods.encrypPassword = async function (password) {
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo que el de la BDD
usuarioSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

export default model('Usuario', usuarioSchema);
