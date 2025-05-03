// models/Etiqueta.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Etiqueta = sequelize.define("Etiqueta", {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [2, 30] }
    },
    descripcion: {
        type: DataTypes.STRING(250),
        allowNull: true
    }
}, {
    timestamps: true,
    charset: 'utf8mb4', // Aseguramos soporte para caracteres especiales
    collate: 'utf8mb4_unicode_ci'
});

export default Etiqueta;
