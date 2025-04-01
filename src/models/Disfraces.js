import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Disfraz = sequelize.define("Disfraz", {
    nombre: {
        type: DataTypes.STRING, allowNull: false, unique: true
    },
    descripcion: {
        type: DataTypes.STRING, allowNull: false
    },
    talla: {
        type: DataTypes.STRING, allowNull: false
    },
    calidad: {
        type: DataTypes.ENUM("Baja", "Media", "Alta"), allowNull: false
    },
    categoria: {
        type: DataTypes.ENUM("Infantil", "Adulto", "Temático"), allowNull: false
    },
    precio: {
        type: DataTypes.FLOAT, allowNull: false
    },
    imagen: {
        type: DataTypes.STRING, defaultValue: null
    },
    favoritos: {
        type: DataTypes.INTEGER, defaultValue: 0
    },
    cotizaciones: {
        type: DataTypes.INTEGER, defaultValue: 0
    }
}, {
    timestamps: true
});

export default Disfraz;
