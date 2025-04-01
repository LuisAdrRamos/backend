// models/Usuario.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import bcrypt from "bcryptjs";

const Usuario = sequelize.define("Usuario", {
    nombre: DataTypes.STRING,

    apellido: DataTypes.STRING,

    email: { 
        type: DataTypes.STRING, unique: true 
    },
    password: DataTypes.STRING,

    celular: DataTypes.STRING,

    direccion: DataTypes.STRING,

    estado: { 
        type: DataTypes.BOOLEAN, defaultValue: true 

    },
    token: DataTypes.STRING,

    fechaRegistro: { 
        type: DataTypes.DATE, defaultValue: DataTypes.NOW 
    }
}, {
    timestamps: true,

    // Puedes usar hooks para encriptar el password automáticamente antes de crear o actualizar
    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.password) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed("password")) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
    }
});

// 🔐 Método para verificar el password (instancia)
Usuario.prototype.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default Usuario;