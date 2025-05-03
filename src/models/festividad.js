import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Festividad = sequelize.define("Festividad", {
    nombre: { 
        type: DataTypes.STRING, allowNull: false 
    },
    descripcion: { 
        type: DataTypes.STRING(250) 
    },
    mes: { 
        type: DataTypes.STRING, allowNull: false 
    },
    dia: { 
        type: DataTypes.INTEGER, allowNull: false 
    },
}, {
    timestamps: true,
    charset: 'utf8mb4', // Aseguramos soporte para caracteres especiales
    collate: 'utf8mb4_unicode_ci'
});

export default Festividad;
