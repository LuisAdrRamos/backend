import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Disfraz = sequelize.define("Disfraz", {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    imagenes: {
        type: DataTypes.JSON, // Arreglo de URLs
        allowNull: false
    },
    favoritos: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    cotizaciones: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true,
    charset: 'utf8mb4', // Aseguramos soporte para caracteres especiales
    collate: 'utf8mb4_unicode_ci'
});

export default Disfraz;
